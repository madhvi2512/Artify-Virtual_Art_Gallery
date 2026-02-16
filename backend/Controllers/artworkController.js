const Artwork = require("../models/Artwork");
const asyncHandler = require("../utils/asyncHandler");

// @desc Get all artworks
// @route GET /api/artworks
exports.getArtworks = asyncHandler(async (req, res) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;
  const keyword = req.query.keyword
    ? { title: { $regex: req.query.keyword, $options: "i" } }
    : {};

  const count = await Artwork.countDocuments({ ...keyword });

  const artworks = await Artwork.find({ ...keyword })
    .populate("artist", "name email")
    .limit(limit)
    .skip(limit * (page - 1))
    .sort({ createdAt: -1 });

  res.json({
    success: true,
    count,
    page,
    pages: Math.ceil(count / limit),
    data: artworks,
  });
});

// @desc Get single artwork
exports.getArtworkById = asyncHandler(async (req, res) => {
  const artwork = await Artwork.findById(req.params.id).populate(
    "artist",
    "name email"
  );

  if (!artwork) {
    res.status(404);
    throw new Error("Artwork not found");
  }

  res.json({
    success: true,
    data: artwork,
  });
});
