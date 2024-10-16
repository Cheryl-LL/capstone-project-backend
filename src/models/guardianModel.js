const connection = require("../configs/db");

// Create a new primary guardian
const createPrimaryGuardian = (guardian, callback) => {
  const query = `
    INSERT INTO PrimaryGuardian (clientId, firstName, lastName, relationship, phoneNumber, email, address, city, province, postalCode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    guardian.clientId,
    guardian.firstName,
    guardian.lastName,
    guardian.relationship,
    guardian.phoneNumber,
    guardian.email,
    guardian.address,
    guardian.city,
    guardian.province,
    guardian.postalCode,
  ];
  connection.query(query, values, callback);
};

// Create a new secondary guardian
const createSecondaryGuardian = (guardian, callback) => {
  const query = `
    INSERT INTO SecondaryGuardian (clientId, firstName, lastName, relationship, phoneNumber, email, address, city, province, postalCode)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
  `;
  const values = [
    guardian.clientId,
    guardian.firstName,
    guardian.lastName,
    guardian.relationship,
    guardian.phoneNumber,
    guardian.email,
    guardian.address,
    guardian.city,
    guardian.province,
    guardian.postalCode,
  ];
  connection.query(query, values, callback);
};

// Get primary guardian by client ID
const getPrimaryGuardianByClientId = (clientId, callback) => {
  const query = "SELECT * FROM PrimaryGuardian WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

// Get secondary guardian by client ID
const getSecondaryGuardianByClientId = (clientId, callback) => {
  const query = "SELECT * FROM SecondaryGuardian WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

// Update primary guardian
const updatePrimaryGuardian = (guardianId, guardian, callback) => {
  const fields = [];
  const values = [];

  Object.keys(guardian).forEach((key) => {
    if (guardian[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(guardian[key]);
    }
  });

  const query = `UPDATE PrimaryGuardian SET ${fields.join(", ")} WHERE guardianId = ?`;
  values.push(guardianId);

  connection.query(query, values, callback);
};

// Update secondary guardian
const updateSecondaryGuardian = (guardianId, guardian, callback) => {
  const fields = [];
  const values = [];

  Object.keys(guardian).forEach((key) => {
    if (guardian[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(guardian[key]);
    }
  });

  const query = `UPDATE SecondaryGuardian SET ${fields.join(", ")} WHERE guardianId = ?`;
  values.push(guardianId);

  connection.query(query, values, callback);
};

// Delete primary guardian
const deletePrimaryGuardian = (guardianId, callback) => {
  const query = "DELETE FROM PrimaryGuardian WHERE guardianId = ?";
  connection.query(query, [guardianId], callback);
};

// Delete secondary guardian
const deleteSecondaryGuardian = (guardianId, callback) => {
  const query = "DELETE FROM SecondaryGuardian WHERE guardianId = ?";
  connection.query(query, [guardianId], callback);
};

module.exports = {
  createPrimaryGuardian,
  createSecondaryGuardian,
  getPrimaryGuardianByClientId,
  getSecondaryGuardianByClientId,
  updatePrimaryGuardian,
  updateSecondaryGuardian,
  deletePrimaryGuardian,
  deleteSecondaryGuardian,
};
