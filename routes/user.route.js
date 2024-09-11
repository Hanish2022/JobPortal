import express from "express";
import { register, login, logout, updateProfile } from "../controllers/user.controller.js";
import isAuthenticated from "../middlewares/auth.middleware.js";
const router = express.Router();

router.route("/register").post(register);
router.route("/login").post(login);
router.route("/logout").get(logout);//koi data nhi h to get req 
router.route("/profile/update").post(isAuthenticated, updateProfile);

export default router;