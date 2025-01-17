import express from "express";
import { checkAuth, login, logout, signup, updateProfile } from "../controllers/auth.controller.js"; // need to put .js as this is a local file and the type is module in package.json
import { protectRoute } from "../middleware/auth.middleware.js";

const router = express.Router();

router.post("/login", login);
router.post("/signup", signup);
router.post("/logout", logout);

//user can only update profile-image not email or fullname..
router.put("/update-profile", protectRoute, updateProfile);

router.get("/check", protectRoute, checkAuth);

export default router;