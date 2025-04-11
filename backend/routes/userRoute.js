import {loginUser, registerUser} from "../controllers/userController.js";
import {forgotPassword, resetPassword} from "../controllers/resetController.js";
import express from "express";

const userRouter = express.Router();

userRouter.post("/login", loginUser);
userRouter.post("/register", registerUser);

userRouter.post("/forgot-password", forgotPassword);

// Reset Password Route
userRouter.post("/reset-password", resetPassword);

export default userRouter;
