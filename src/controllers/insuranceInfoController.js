const {
    createInsuranceInfo,
    getAllInsuranceInfo,
    getInsuranceInfoByClientId,
    updateInsuranceInfoById,
    deleteInsuranceInfoById,
    getInsuranceInfoById,
  } = require("../models/insuranceInfoModel");
  
  // Controller to create a new insurance info
  const createInsuranceInfoController = (req, res) => {
    const { clientId, insuranceProvider, primaryPlanName, certificateId, coverateDetail, startDate, endDate } = req.body;
  
    if (!clientId || !insuranceProvider || !primaryPlanName || !certificateId || !startDate || !endDate) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    const insuranceData = { clientId, insuranceProvider, primaryPlanName, certificateId, coverateDetail, startDate, endDate };
  
    createInsuranceInfo(insuranceData, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error creating insurance info", error: err });
      }
      res.status(201).json({
        message: "Insurance info created successfully",
        insuranceInfo: result,
      });
    });
  };
  
  // Controller to get insurance info by clientId
  const getInsuranceInfoByClientIdController = (req, res) => {
    const { clientId } = req.params;
  
    if (!clientId) {
      return res.status(400).json({ message: "Client ID is required" });
    }
  
    getInsuranceInfoByClientId(clientId, (err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching insurance info", error: err });
      }
      if (!results || results.length === 0) {
        return res.status(404).json({ message: "No insurance info found for the client" });
      }
      res.status(200).json(results);
    });
  };
  
  // Controller to update insurance info by ID
  const updateInsuranceInfoByIdController = (req, res) => {
    const { insuranceInfoId } = req.params;
    const insuranceData = req.body;
  
    if (!insuranceInfoId || !insuranceData) {
      return res.status(400).json({ message: "Missing required fields" });
    }
  
    updateInsuranceInfoById(insuranceInfoId, insuranceData, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error updating insurance info", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Insurance info not found" });
      }
      res.status(200).json({ message: "Insurance info updated successfully" });
    });
  };
  
  // Controller to delete insurance info by ID
  const deleteInsuranceInfoByIdController = (req, res) => {
    const { insuranceInfoId } = req.params;
  
    if (!insuranceInfoId) {
      return res.status(400).json({ message: "Insurance Info ID is required" });
    }
  
    deleteInsuranceInfoById(insuranceInfoId, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error deleting insurance info", error: err });
      }
      if (result.affectedRows === 0) {
        return res.status(404).json({ message: "Insurance info not found" });
      }
      res.status(200).json({ message: "Insurance info deleted successfully" });
    });
  };
  
  // Controller to get all insurance info
  const getAllInsuranceInfoController = (req, res) => {
    getAllInsuranceInfo((err, results) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching insurance info", error: err });
      }
      res.status(200).json(results);
    });
  };
  
  // Controller to get insurance info by insuranceInfoId
  const getInsuranceInfoByIdController = (req, res) => {
    const { insuranceInfoId } = req.params;
  
    if (!insuranceInfoId) {
      return res.status(400).json({ message: "Insurance Info ID is required" });
    }
  
    getInsuranceInfoById(insuranceInfoId, (err, result) => {
      if (err) {
        return res.status(500).json({ message: "Error fetching insurance info", error: err });
      }
      if (!result) {
        return res.status(404).json({ message: "Insurance info not found" });
      }
      res.status(200).json(result);
    });
  };
  
  module.exports = {
    createInsuranceInfoController,
    getInsuranceInfoByClientIdController,
    updateInsuranceInfoByIdController,
    deleteInsuranceInfoByIdController,
    getAllInsuranceInfoController,
    getInsuranceInfoByIdController,
  };
  