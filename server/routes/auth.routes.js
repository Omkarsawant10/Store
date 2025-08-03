import express from "express";
import { getMe, loginUser, logoutUser, registerUser } from "../controllers/auth.controller.js";

export const authrouter=express.Router();

authrouter.post("/register",registerUser);

authrouter.post("/login",loginUser);

authrouter.get("/logout",logoutUser)

authrouter.get("/me", getMe);