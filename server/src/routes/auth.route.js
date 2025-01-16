import express from "express";
import { login, logout, signup, updateProfile } from "../controllers/auth.controller.js"; // need to put .js as this is a local file and the type is module in package.json

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

//user can only update profile-image not email or fullname..
router.put("/update-profile", protectRoute, updateProfile);

export default router;