const express = require("express");
const router = express.Router();
const {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdByAdminController,
  deleteUserByIdController,
  updateUserByIdBySelfController,
} = require("../controllers/userController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Protect routes
router.get("/", authenticateToken, getAllUsersController);
router.get("/:id", authenticateToken, getUserByIdController);
router.patch(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  updateUserByIdByAdminController
);
router.delete(
  "/:id",
  authenticateToken,
  authorizeAdmin,
  deleteUserByIdController
);
router.patch("/:id/profile", authenticateToken, updateUserByIdBySelfController);

module.exports = router;
