const {
  assignTeamMember,
  getTeamMembersByClientId,
  getClientsForTeamMember,
  checkTeamMemberbyClient,
  unassignTeamMember,
} = require("../models/teamMemberModel");
const { getUserById } = require("../models/userModel");

// Controller to assign a team member to a client
const assignTeamMemberController = (req, res) => {
  const { clientId, userId, startServiceDate, endServiceDate } = req.body;

  // Validate required fields
  if (!clientId || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  checkTeamMemberbyClient(clientId, userId, (err, results) => {
    if (err) {
      return res
        .status(500)
        .json({ message: "Error checking existing assignment", error: err });
    }

    // If a result is found, it means the assignment already exists
    if (results.length > 0) {
      return res
        .status(400)
        .json({ message: "Team member is already assigned to this client." });
    }

    // If no result is found, proceed with the assignment
    assignTeamMember(
      clientId,
      userId,
      startServiceDate,
      endServiceDate,
      (err, results) => {
        if (err) {
          return res
            .status(500)
            .json({ message: "Error assigning team member", error: err });
        }
        res
          .status(201)
          .json({
            message: "Team member assigned successfully",
            teamMemberId: results.insertId,
          });
      }
    );
  });
};

// Controller to get all team members for a specific client
const getTeamMembersByClientIdController = async (req, res) => {
  const { clientId } = req.params;

  if (!clientId) {
    return res.status(400).json({ message: "Client ID is required" });
  }

  try {
    // Fetch team members using the Promise-based function
    const results = await getTeamMembersByClientId(clientId);
    return res.status(200).json(results);
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error fetching team members", error: err });
  }
};

const getClientsForTeamMemberController = async (req, res) => {
  const userId = req.params.userId;
  const loggedInUserId = req.user.id;
  console.log("Received userId:", userId);
  console.log("logged in", req.user.id);

  try {
    // Check if the team member ID matches the logged-in user's ID
    const teamMember = await getUserById(userId);
    console.log(teamMember);
    if (!teamMember) {
      return res.status(404).json({ message: "Team member not found" });
    }

    // Verify that the logged-in user is the same as the user associated with the team member
    if (String(userId) !== String(loggedInUserId)) {
      return res
        .status(403)
        .send({ message: "You are not authorized to update this profile." });
    }

    // Fetch all clients for the team member
    const clients = await getClientsForTeamMember(userId);
    return res.status(200).json({ data: clients });
  } catch (err) {
    console.error("Error fetching clients for team member:", err);
    return res
      .status(500)
      .json({ message: "Error fetching clients", error: err });
  }
};

const unassignTeamMemberController = async (req, res) => {
  const { clientId, userId } = req.params;

  // Validate required fields
  if (!clientId || !userId) {
    return res.status(400).json({ message: "Missing required fields" });
  }
  
  try {
    console.log('delete start')
    const results = await unassignTeamMember(clientId, userId);
    console.log("Results from DELETE query:", results);

    // If no rows were affected, it means the team member was not assigned
    if (results.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Team member assignment not found" });
    }

    return res
      .status(200)
      .json({ message: "Team member unassigned successfully" });
  } catch (err) {
    return res
      .status(500)
      .json({ message: "Error unassigning team member", error: err });
  }
};

// Export the controller functions
module.exports = {
  assignTeamMemberController,
  getTeamMembersByClientIdController,
  getClientsForTeamMemberController,
  unassignTeamMemberController
};
