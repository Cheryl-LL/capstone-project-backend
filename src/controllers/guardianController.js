const {
    createPrimaryGuardian,
    createSecondaryGuardian,
    getPrimaryGuardianByClientId,
    getSecondaryGuardianByClientId,
    updatePrimaryGuardian,
    updateSecondaryGuardian,
    deletePrimaryGuardian,
    deleteSecondaryGuardian,
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
  
  // Create secondary guardian
  const createSecondaryGuardianController = (req, res) => {
    const guardian = req.body;
    createSecondaryGuardian(guardian, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(201).send({ message: "Secondary guardian created successfully" });
    });
  };
  
  // Get primary guardian by client ID
  const getPrimaryGuardianController = (req, res) => {
    const clientId = req.params.clientId;
    getPrimaryGuardianByClientId(clientId, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(results[0]);
    });
  };
  
  // Get secondary guardian by client ID
  const getSecondaryGuardianController = (req, res) => {
    const clientId = req.params.clientId;
    getSecondaryGuardianByClientId(clientId, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(results[0]);
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
  
  // Update secondary guardian
  const updateSecondaryGuardianController = (req, res) => {
    const guardianId = req.params.guardianId;
    const guardian = req.body;
    updateSecondaryGuardian(guardianId, guardian, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: "Secondary guardian updated successfully" });
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
  
  // Delete secondary guardian
  const deleteSecondaryGuardianController = (req, res) => {
    const guardianId = req.params.guardianId;
    deleteSecondaryGuardian(guardianId, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send({ message: "Secondary guardian deleted successfully" });
    });
  };
  
  module.exports = {
    createPrimaryGuardianController,
    createSecondaryGuardianController,
    getPrimaryGuardianController,
    getSecondaryGuardianController,
    updatePrimaryGuardianController,
    updateSecondaryGuardianController,
    deletePrimaryGuardianController,
    deleteSecondaryGuardianController,
  };
  