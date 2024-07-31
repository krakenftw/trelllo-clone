import { Router } from "express";
import {
  getUserData,
  handleUserLogin,
  handleUserLogout,
  handleUserRegister,
} from "../controllers/user";
import { isAuthenticated } from "../middlewares/isAuth";

export const userRouter: Router = Router();

userRouter.get("/", isAuthenticated, getUserData);
userRouter.post("/login", handleUserLogin);
userRouter.post("/register", handleUserRegister);
userRouter.post("/logout", handleUserLogout);
