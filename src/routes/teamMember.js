const express = require('express');
const {
  assignTeamMemberController,
  getTeamMembersByClientIdController,
  getClientsForTeamMemberController,
} = require('../controllers/teammemberController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to assign a team member to a client
router.post('/assign', authenticateToken, authorizeAdmin, assignTeamMemberController);

// Route to get all team members assigned to a client
router.get('/client/:clientId', authenticateToken, authorizeAdmin, getTeamMembersByClientIdController);

// Route to get the assigned clients of the team member
router.get('/user/:userId', authenticateToken, getClientsForTeamMemberController)

module.exports = router;