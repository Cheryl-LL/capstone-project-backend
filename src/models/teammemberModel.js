const connection = require('../configs/db');

// Function to assign a team member to a client (insert into TeamMember table)
const assignTeamMember = (clientId, userId, schedule, callback) => {
  const query = `
    INSERT INTO TeamMember (clientId, userId, schedule)
    VALUES (?, ?, ?)
  `;
  connection.query(query, [clientId, userId, schedule], (err, results) => {
    if (err) {
      console.error("Error assigning team member:", err);
      return callback(err);
    }
    return callback(null, results);
  });
};

// Function to get all team members for a specific client
const getTeamMembersByClientId = (clientId, callback) => {
  const query = `
    SELECT tm.teamMemberId, u.userId, u.firstName, u.lastName, u.role, u.contractStartDate, u.contractEndDate, u.rate, tm.schedule
    FROM TeamMember tm
    JOIN users u ON tm.userId = u.userId
    WHERE tm.clientId = ?
  `;
  connection.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching team members for client:", err);
      return callback(err);
    }
    return callback(null, results);
  });
};

module.exports = {
  assignTeamMember,
  getTeamMembersByClientId,
};
