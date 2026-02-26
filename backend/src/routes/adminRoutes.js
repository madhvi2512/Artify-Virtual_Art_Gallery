const express = require("express");
const { verifyToken, isAdmin } = require("../middleware/authMiddleware");
const {
  dashboardStats,
  listUsers,
  listFixedAdmins,
  getUserDetails,
  blockUser,
  unblockUser,
  softDeleteUser,
  changeUserRole,
  listArtistRequests,
  approveArtistRequest,
  rejectArtistRequest,
  listArtworks,
  updateArtworkStatus,
  deleteArtwork,
  listOrders,
  getOrderDetails,
  updateOrderStatus,
  refundOrder,
  listCategories,
  createCategory,
  updateCategory,
  deleteCategory,
  monthlyRevenue,
  userGrowth,
  topSellingArtworks,
  topArtists,
  recentActivities,
  exportUsersCsv,
} = require("../controllers/adminController");

const router = express.Router();

router.use(verifyToken, isAdmin);

router.get("/dashboard", dashboardStats);

router.get("/users", listUsers);
router.get("/users/fixed-admins", listFixedAdmins);
router.get("/users/:id", getUserDetails);
router.patch("/users/:id/block", blockUser);
router.patch("/users/:id/unblock", unblockUser);
router.patch("/users/:id/role", changeUserRole);
router.delete("/users/:id", softDeleteUser);

router.get("/artist-requests", listArtistRequests);
router.patch("/artist-requests/:id/approve", approveArtistRequest);
router.patch("/artist-requests/:id/reject", rejectArtistRequest);

router.get("/artworks", listArtworks);
router.patch("/artworks/:id/status", updateArtworkStatus);
router.delete("/artworks/:id", deleteArtwork);

router.get("/orders", listOrders);
router.get("/orders/:id", getOrderDetails);
router.patch("/orders/:id/status", updateOrderStatus);
router.patch("/orders/:id/refund", refundOrder);

router.get("/categories", listCategories);
router.post("/categories", createCategory);
router.patch("/categories/:id", updateCategory);
router.delete("/categories/:id", deleteCategory);

router.get("/analytics/monthly-revenue", monthlyRevenue);
router.get("/analytics/user-growth", userGrowth);
router.get("/analytics/top-selling-artwork", topSellingArtworks);
router.get("/analytics/top-artists", topArtists);

router.get("/activities/recent", recentActivities);

router.get("/export/users.csv", exportUsersCsv);

module.exports = router;
