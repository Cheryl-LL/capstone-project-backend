const express = require('express');
const {
  assignTeamMemberController,
  getTeamMembersByClientIdController,
} = require('../controllers/teammemberController');
const { authenticateToken, authorizeAdmin } = require('../middleware/authMiddleware');

const router = express.Router();

// Route to assign a team member to a client
router.post('/assign', authenticateToken, authorizeAdmin, assignTeamMemberController);

// Route to get all team members assigned to a client
router.get('/client/:clientId', getTeamMembersByClientIdController);

module.exports = router;