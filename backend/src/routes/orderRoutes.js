const express = require("express");
const Order = require("../models/Order");
const Artwork = require("../models/Artwork");
const asyncHandler = require("../utils/asyncHandler");
const { protect, authorize } = require("../middleware/authMiddleware");

const router = express.Router();

//
// 🛒 CUSTOMER ROUTES
//

// Place Order
router.post(
  "/",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    const { artworkId } = req.body;

    const artwork = await Artwork.findById(artworkId);

    if (!artwork) {
      res.status(404);
      throw new Error("Artwork not found");
    }

    const order = await Order.create({
      artwork: artwork._id,
      customer: req.user._id,
      price: artwork.price,
    });

    res.status(201).json({
      success: true,
      data: order,
    });
  })
);

// Get My Orders (Customer)
router.get(
  "/my-orders",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    const orders = await Order.find({ customer: req.user._id })
      .populate("artwork")
      .populate("customer", "name email");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  })
);

//
// 🎨 ARTIST ROUTES
//

// Get Orders For My Artworks
router.get(
  "/artist-orders",
  protect,
  authorize("artist"),
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate({
        path: "artwork",
        match: { artist: req.user._id },
      })
      .populate("customer", "name email");

    const filteredOrders = orders.filter(order => order.artwork !== null);

    res.json({
      success: true,
      count: filteredOrders.length,
      data: filteredOrders,
    });
  })
);

// Cancel Order (Customer)
router.put(
  "/cancel/:id",
  protect,
  authorize("customer"),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Make sure this customer owns the order
    if (order.customer.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only cancel your own orders");
    }

    if (order.status !== "pending") {
      res.status(400);
      throw new Error("Only pending orders can be cancelled");
    }

    order.status = "rejected";
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  })
);
// Admin: Get All Orders
router.get(
  "/",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const orders = await Order.find()
      .populate("customer", "name email")
      .populate("artwork");

    res.json({
      success: true,
      count: orders.length,
      data: orders,
    });
  })
);
// Admin: Delete Order
router.delete(
  "/:id",
  protect,
  authorize("admin"),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id);

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    await order.deleteOne();

    res.json({
      success: true,
      message: "Order deleted successfully",
    });
  })
);

// Update Order Status (Artist Only)
router.put(
  "/:id",
  protect,
  authorize("artist"),
  asyncHandler(async (req, res) => {
    const order = await Order.findById(req.params.id).populate("artwork");

    if (!order) {
      res.status(404);
      throw new Error("Order not found");
    }

    // Ownership check
    if (order.artwork.artist.toString() !== req.user._id.toString()) {
      res.status(403);
      throw new Error("You can only manage your own artwork orders");
    }

    const { status } = req.body;

    if (!["pending", "accepted", "rejected", "completed"].includes(status)) {
      res.status(400);
      throw new Error("Invalid order status");
    }

    order.status = status;
    await order.save();

    res.json({
      success: true,
      data: order,
    });
  })
);

module.exports = router;
