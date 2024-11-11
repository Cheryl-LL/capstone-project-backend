const {
  createPrimaryGuardian,
  getPrimaryGuardianByClientId,
  updatePrimaryGuardian,
  deletePrimaryGuardian,
} = require("../models/guardianModel");

// Create primary guardian
const createPrimaryGuardianController = (req, res) => {
  const guardian = req.body;
  createPrimaryGuardian(guardian, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send({ message: "Primary guardian created successfully" });
  });
};

// Get primary guardian by client ID
const getPrimaryGuardianController = (req, res) => {
  const clientId = req.params.clientId;
  getPrimaryGuardianByClientId(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

// Update primary guardian
const updatePrimaryGuardianController = (req, res) => {
  const guardianId = req.params.guardianId;
  const guardian = req.body;
  updatePrimaryGuardian(guardianId, guardian, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: "Primary guardian updated successfully" });
  });
};

// Delete primary guardian
const deletePrimaryGuardianController = (req, res) => {
  const guardianId = req.params.guardianId;
  deletePrimaryGuardian(guardianId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send({ message: "Primary guardian deleted successfully" });
  });
};

module.exports = {
  createPrimaryGuardianController,
  getPrimaryGuardianController,
  updatePrimaryGuardianController,
  deletePrimaryGuardianController,
};
