import jwt from "jsonwebtoken";
import User from "../models/User.js";
import {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
} from "../middleware/generateTokens.js";

// @route POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    const { name, email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(409).json({ message: "Email is already registered" });
    }

    const user = await User.create({ name, email, password });

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(201).json({
      message: "Account created successfully",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Signup failed", error: error.message });
  }
};

// @route POST /api/auth/login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Explicitly select password since the schema excludes it by default
    const user = await User.findOne({ email }).select("+password");

    // Same generic message whether the email doesn't exist or the password is
    // wrong — don't reveal which one, so attackers can't enumerate emails.
    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({ message: "Invalid email or password" });
    }

    const accessToken = generateAccessToken(user._id);
    const refreshToken = generateRefreshToken(user._id);

    user.refreshToken = refreshToken;
    await user.save();

    setRefreshTokenCookie(res, refreshToken);

    return res.status(200).json({
      message: "User has successfully logged in",
      accessToken,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (error) {
    return res.status(500).json({ message: "Login failed", error: error.message });
  }
};

// @route POST /api/auth/refresh
// Frontend calls this when the short-lived access token expires, to get a
// new one without forcing the user to log in again.
// export const refresh = async (req, res) => {
//   try {
//     const token = req.cookies.refreshToken;
//     if (!token) return res.status(401).json({ message: "No refresh token" });

//     const decoded = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
//     const user = await User.findById(decoded.id).select("+refreshToken");

//     if (!user || user.refreshToken !== token) {
//       return res.status(403).json({ message: "Invalid refresh token" });
//     }

//     const newAccessToken = generateAccessToken(user._id);
//     return res.status(200).json({ accessToken: newAccessToken });
//   } catch (error) {
//     return res.status(403).json({ message: "Refresh token expired or invalid" });
//   }
// };
export const refresh = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;

    if (!token) {
      return res.status(401).json({
        message: "No refresh token",
      });
    }

    const decoded = jwt.verify(
      token,
      process.env.JWT_REFRESH_SECRET
    );

    const user = await User.findById(decoded.id).select("+refreshToken");

    if (!user || user.refreshToken !== token) {
      return res.status(403).json({
        message: "Invalid refresh token",
      });
    }

    const newAccessToken = generateAccessToken(user._id);

    return res.status(200).json({
      accessToken: newAccessToken,
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
      },
    });
  } catch (error) {
    return res.status(403).json({
      message: "Refresh token expired or invalid",
    });
  }
};
// @route POST /api/auth/logout
export const logout = async (req, res) => {
  try {
    const token = req.cookies.refreshToken;
    if (token) {
      const decoded = jwt.decode(token);
      if (decoded?.id) {
        await User.findByIdAndUpdate(decoded.id, { refreshToken: "" });
      }
    }
    res.clearCookie("refreshToken", { path: "/api/auth" });
    return res.status(200).json({ message: "Logged out successfully" });
  } catch (error) {
    return res.status(500).json({ message: "Logout failed", error: error.message });
  }
};

// @route GET /api/auth/me  (protected — used to fetch current user on app load)
export const getMe = async (req, res) => {
  return res.status(200).json({
    user: { id: req.user._id, name: req.user.name, email: req.user.email },
  });
};