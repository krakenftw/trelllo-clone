import { Router } from "express";
import { handleUserLogin, handleUserRegister } from "../controllers/user";

export const userRouter: Router = Router();

userRouter.post("/login", handleUserLogin);
userRouter.post("/register", handleUserRegister);
