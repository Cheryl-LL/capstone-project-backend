const {
  getAllPatients,
  createPatient,
  getPatientById,
  updatePatientById,
  deletePatientById,
} = require("../models/patientModel");

const getAllPatientsController = (req, res) => {
  getAllPatients((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
}

const createPatientController = (req, res) => {
  const patient = req.body;
  createPatient(patient, (err, createdPatient) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.status(201).send(createdPatient);
  });
};

const getPatientController = (req, res) => {
  const { clientId } = req.params;
  getPatientById(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Patient not found");
    }
    res.status(200).send(results[0]);
  });
};

const updatePatientController = (req, res) => {
  const { clientId } = req.params;
  const patient = req.body;

  // check if the patient exists
  getPatientById(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Patient not found");
    }

    // update if the patient exists
    updatePatientById(clientId, patient, (err, updateResults) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send(updateResults);
    });
  });
};



const deletePatientController = (req, res) => {
  const { clientId } = req.params;

  // check if the patient exists
  getPatientById(clientId, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("Patient not found");
    }

    // delete if the patient exists
    deletePatientById(clientId, (err, deleteResults) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.status(200).send({ message: "Patient successfully deleted" });
    });
  });
};

module.exports = {
  getAllPatientsController,
  createPatientController,
  getPatientController,
  updatePatientController,
  deletePatientController,
};
