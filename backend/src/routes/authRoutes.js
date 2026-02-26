const express = require("express");
const jwt = require("jsonwebtoken");
const { body } = require("express-validator");

const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { validate } = require("../middleware/validationMiddleware");
const { sendResponse } = require("../utils/apiResponse");
const { isFixedAdminEmail } = require("../config/adminAccounts");

const router = express.Router();

const normalizeRole = (role = "") => (role === "customer" ? "user" : role);

const generateToken = (id, role) =>
  jwt.sign({ id, role }, process.env.JWT_SECRET, { expiresIn: "7d" });

router.post(
  "/register",
  [
    body("name")
      .trim()
      .notEmpty()
      .withMessage("Name is required")
      .isLength({ min: 2, max: 50 })
      .withMessage("Name must be between 2 and 50 characters"),
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password")
      .isStrongPassword({
        minLength: 6,
        minLowercase: 0,
        minUppercase: 0,
        minNumbers: 1,
        minSymbols: 0,
      })
      .withMessage("Password must be 6+ chars and include at least one number"),
    body("role")
      .optional()
      .isIn(["artist", "user", "customer"])
      .withMessage("Role must be artist or user"),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const { name, password } = req.body;
    const email = String(req.body.email || "").toLowerCase();
    const role = normalizeRole(req.body.role || "user");

    if (isFixedAdminEmail(email)) {
      res.status(403);
      throw new Error("This email is reserved for system admin access");
    }

    const userExists = await User.findOne({ email });

    if (userExists) {
      res.status(400);
      throw new Error("User already exists");
    }

    const user = await User.create({
      name,
      email,
      password,
      role,
    });

    return sendResponse(res, {
      statusCode: 201,
      message: "Registration successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        profileImage: user.profileImage,
        specialty: user.specialty,
        token: generateToken(user._id, user.role),
      },
    });
  })
);

router.post(
  "/login",
  [
    body("email").isEmail().withMessage("Valid email required").normalizeEmail(),
    body("password")
      .notEmpty()
      .withMessage("Password is required")
      .isLength({ min: 6 })
      .withMessage("Password must be at least 6 characters"),
  ],
  validate,
  asyncHandler(async (req, res) => {
    const email = String(req.body.email || "").toLowerCase();
    const { password } = req.body;

    const user = await User.findOne({ email });

    if (!user || user.isDeleted) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    if (user.isBlocked) {
      res.status(403);
      throw new Error("Your account is blocked");
    }

    if (isFixedAdminEmail(email) && user.role !== "admin") {
      res.status(403);
      throw new Error("This account is reserved for admin access only");
    }

    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      res.status(401);
      throw new Error("Invalid email or password");
    }

    return sendResponse(res, {
      message: "Login successful",
      data: {
        _id: user._id,
        name: user.name,
        email: user.email,
        role: normalizeRole(user.role),
        profileImage: user.profileImage,
        specialty: user.specialty,
        token: generateToken(user._id, user.role),
      },
    });
  })
);

module.exports = router;
