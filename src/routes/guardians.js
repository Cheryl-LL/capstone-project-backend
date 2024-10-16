const express = require("express");
const router = express.Router();
const {
  createPrimaryGuardianController,
  createSecondaryGuardianController,
  getPrimaryGuardianController,
  getSecondaryGuardianController,
  updatePrimaryGuardianController,
  updateSecondaryGuardianController,
  deletePrimaryGuardianController,
  deleteSecondaryGuardianController,
} = require("../controllers/guardianController");
const {
  authenticateToken,
  authorizeAdmin,
} = require("../middleware/authMiddleware");

// Primary Guardian Routes
router.post("/primary", authenticateToken, authorizeAdmin, createPrimaryGuardianController);
router.get("/primary/:clientId", authenticateToken, getPrimaryGuardianController);
router.put("/primary/:guardianId", authenticateToken, authorizeAdmin, updatePrimaryGuardianController);
router.delete("/primary/:guardianId", authenticateToken, authorizeAdmin, deletePrimaryGuardianController);

// Secondary Guardian Routes
router.post("/secondary", authenticateToken, authorizeAdmin, createSecondaryGuardianController);
router.get("/secondary/:clientId", authenticateToken, getSecondaryGuardianController);
router.put("/secondary/:guardianId", authenticateToken, authorizeAdmin, updateSecondaryGuardianController);
router.delete("/secondary/:guardianId", authenticateToken, authorizeAdmin, deleteSecondaryGuardianController);
console.log({
    createPrimaryGuardianController,
    createSecondaryGuardianController,
    getPrimaryGuardianController,
    getSecondaryGuardianController,
    updatePrimaryGuardianController,
    updateSecondaryGuardianController,
    deletePrimaryGuardianController,
    deleteSecondaryGuardianController,
  });
module.exports = router;


