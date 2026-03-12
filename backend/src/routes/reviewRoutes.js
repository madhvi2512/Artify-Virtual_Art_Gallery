const express = require("express");

const { createReview, getArtworkReviews } = require("../controllers/reviewController");
const { authorize, protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, authorize("user"), createReview);
router.get("/:artworkId", getArtworkReviews);

module.exports = router;
