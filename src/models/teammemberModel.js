const connection = require("../configs/db");

// Function to assign a team member to a client (insert into TeamMember table)
const assignTeamMember = (
  clientId,
  userId,
  schedule,
  startServiceDate,
  endServiceDate,
  callback
) => {
  const query = `
    INSERT INTO TeamMember (clientId, userId, schedule, startServiceDate, endServiceDate)
    VALUES (?, ?, ?, ?, ?)
  `;

  // Check if endServiceDate is provided, if not, pass null
  connection.query(
    query,
    [clientId, userId, schedule, startServiceDate, endServiceDate || null],
    (err, results) => {
      if (err) {
        console.error("Error assigning team member:", err);
        return callback(err);
      }
      return callback(null, results);
    }
  );
};

// Function to get all team members for a specific client
const getTeamMembersByClientId = (clientId, callback) => {
  const query = `
  SELECT 
    ec.clientId, ec.psNote, ec.firstName, ec.lastName, ec.gender, ec.birthDate, ec.address, ec.city, ec.postalCode, 
    ec.phoneNumber, ec.email, ec.school, ec.age, ec.currentStatus, ec.fscdIdNum, ec.contractId, ec.guardianId, 
    ec.insuranceInfoId, ec.diagnosisId, ec.consentId, ec.teamMemberId, ec.outsideProviderId,
    tm.teamMemberId, tm.startServiceDate, tm.endServiceDate, tm.schedule,
    u.userId, u.firstName AS userFirstName, u.lastName AS userLastName, u.role, u.rate
  FROM ExistingClient ec
  JOIN TeamMember tm ON ec.clientId = tm.clientId
  JOIN users u ON tm.userId = u.userId
  WHERE ec.clientId = ?
`;
  connection.query(query, [clientId], (err, results) => {
    if (err) {
      console.error("Error fetching team members for client:", err);
      return callback(err);
    }
    return callback(null, results);
  });
};

const getClientsForTeamMember = (teamMemberId) => {
  return new Promise((resolve, reject) => {
    const query = `
      SELECT ec.*
      FROM ExistingClient ec
      JOIN TeamMember tm ON ec.clientId = tm.clientId
      WHERE tm.userId = ?
    `;
    connection.query(query, [teamMemberId], (err, results) => {
      if (err) {
        return reject(err);
      }
      resolve(results);
    });
  });
};


const checkTeamMemberbyClient = (clientId, userId, callback) => {
  const query = `
    SELECT * FROM TeamMember WHERE clientId = ? AND userId = ?
  `;
  connection.query(query, [clientId, userId], (err, results) => {
    if (err) {
      console.error("Error checking team member assignment:", err);
      return callback(err);
    }

    return callback(null, results);
  });
};

module.exports = {
  assignTeamMember,
  getTeamMembersByClientId,
  getClientsForTeamMember,
  checkTeamMemberbyClient
};
