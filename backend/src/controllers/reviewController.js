const Artwork = require("../models/Artwork");
const Order = require("../models/Order");
const Review = require("../models/Review");
const asyncHandler = require("../utils/asyncHandler");
const { sendResponse } = require("../utils/apiResponse");

const createReview = asyncHandler(async (req, res) => {
  const { artworkId, rating, comment = "" } = req.body;

  if (!artworkId || !rating) {
    res.status(400);
    throw new Error("Artwork and rating are required");
  }

  const artwork = await Artwork.findById(artworkId);
  if (!artwork) {
    res.status(404);
    throw new Error("Artwork not found");
  }

  const hasOrder = await Order.findOne({ artworkId, userId: req.user._id });
  if (!hasOrder) {
    res.status(403);
    throw new Error("You can only review purchased artwork");
  }

  const review = await Review.findOneAndUpdate(
    { userId: req.user._id, artworkId },
    { rating: Number(rating), comment },
    { new: true, upsert: true, setDefaultsOnInsert: true }
  ).populate("userId", "name profileImage");

  sendResponse(res, {
    statusCode: 201,
    message: "Review saved successfully",
    data: review,
  });
});

const getArtworkReviews = asyncHandler(async (req, res) => {
  const reviews = await Review.find({ artworkId: req.params.artworkId })
    .populate("userId", "name profileImage")
    .sort({ createdAt: -1 });

  sendResponse(res, {
    data: reviews,
  });
});

module.exports = {
  createReview,
  getArtworkReviews,
};
