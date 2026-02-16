const express = require("express");
const User = require("../models/User");
const asyncHandler = require("../utils/asyncHandler");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

// Create User
router.post(
  "/",
  asyncHandler(async (req, res) => {
    const { name, email, password } = req.body;

    const user = await User.create({ name, email, password });

    res.status(201).json({
      success: true,
      data: user,
    });
  })
);

// Get Profile
router.get(
  "/profile",
  protect,
  asyncHandler(async (req, res) => {
    res.json(req.user);
  })
);

// Admin Only
router.get(
  "/admin-only",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    res.json({ message: "Welcome Admin" });
  })
);

module.exports = router;
