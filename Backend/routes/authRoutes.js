import express from "express";
import rateLimit from "express-rate-limit";
import { signup, login, refresh, logout, getMe } from "../controllers/authController.js";
import { signupRules, loginRules, validate } from "../middleware/validators.js";
import protect from "../middleware/protect.js";

const router = express.Router();

// Slows down brute-force login/signup attempts from a single IP
const authLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 20,
  message: { message: "Too many attempts, please try again later" },
});

router.post("/signup", authLimiter, signupRules, validate, signup);
router.post("/login", authLimiter, loginRules, validate, login);
router.post("/refresh", refresh);
router.post("/logout", logout);
router.get("/me", protect, getMe);

export default router;