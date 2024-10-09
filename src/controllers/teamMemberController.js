const { assignTeamMember, getTeamMembersByClientId } = require('../models/teamMemberModel');

// Controller to assign a team member to a client
const assignTeamMemberController = (req, res) => {
  const { clientId, userId, schedule } = req.body;

  // Validate required fields
  if (!clientId || !userId || !schedule) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  // Use the model to assign the team member to the client
  assignTeamMember(clientId, userId, schedule, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error assigning team member", error: err });
    }
    res.status(201).json({ message: "Team member assigned successfully", teamMemberId: results.insertId });
  });
};

// Controller to get all team members for a specific client
const getTeamMembersByClientIdController = (req, res) => {
  const { clientId } = req.params;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  // Use the model to fetch team members for the client
  getTeamMembersByClientId(clientId, (err, results) => {
    if (err) {
      return res.status(500).json({ message: "Error fetching team members", error: err });
    }
    res.status(200).json(results);
  });
};

// Export the controller functions
module.exports = {
  assignTeamMemberController,
  getTeamMembersByClientIdController,
};
