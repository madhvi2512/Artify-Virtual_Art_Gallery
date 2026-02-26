const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    artwork: { type: mongoose.Schema.Types.ObjectId, ref: "Artwork", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    price: { type: Number, required: true, min: 0 },
    status: {
      type: String,
      enum: ["pending", "accepted", "rejected", "completed", "cancelled"],
      default: "pending",
    },
    paymentStatus: {
      type: String,
      enum: ["pending", "paid", "failed", "refunded"],
      default: "paid",
    },
    refund: {
      isRefunded: { type: Boolean, default: false },
      reason: { type: String, default: "" },
      refundedAt: { type: Date, default: null },
      refundedBy: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    },
    isDeleted: { type: Boolean, default: false },
  },
  { timestamps: true }
);

module.exports = mongoose.models.Order || mongoose.model("Order", orderSchema);
