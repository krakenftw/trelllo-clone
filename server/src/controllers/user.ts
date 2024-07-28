import { Request, Response } from "express";
import User, { IUser } from "../common/schema/user.schema";
import bcrypt from "bcrypt";

export const handleUserLogin = async (req: Request, res: Response) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: "Invalid fields" });
  }

  try {
    const user: IUser | null = await User.findOne({ email }).select(
      "+password",
    );

    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const isPasswordValid: boolean = await bcrypt.compare(
      password,
      user.password!,
    );

    if (!isPasswordValid) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    req.session.user = {
      id: user._id,
      name: user.name!,
      email: user.email!,
    };

    return res.status(200).json({ message: "User logged in successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export const handleUserRegister = async (req: Request, res: Response) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ message: "Invalid fields" });
  }

  try {
    const userPresent = await User.findOne({ email });
    if (userPresent) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashedPassword = await bcrypt.hash(password, 12);

    const newUser = new User({
      name,
      email,
      password: hashedPassword,
    });

    await newUser.save();

    console.log(newUser);

    req.session.user = {
      id: newUser.id,
      name: newUser.name!,
      email: newUser.email!,
    };

    return res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

export async function getUserData(req: Request, res: Response) {
  try {
    if (!req.session.user || !req.session.user.id) {
      return res
        .status(401)
        .json({ message: "Unauthorized: User not logged in" });
    }

    const userId = req.session.user.id;

    const user = await User.findById(userId).select("name email");

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.status(200).json({
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    console.error("Error in getUserData:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
}
