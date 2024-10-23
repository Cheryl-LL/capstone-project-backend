const connection = require("../configs/db");

// Function to get all insurance info
const getAllInsuranceInfo = (callback) => {
  const query = "SELECT * FROM InsuranceInfo";
  connection.query(query, callback);
};

// Function to create new insurance info
const createInsuranceInfo = (insuranceData, callback) => {
  const query = `
    INSERT INTO InsuranceInfo 
    (clientId, insuranceProvider, primaryPlanName, certificateId, coverateDetail, startDate, endDate)
    VALUES (?, ?, ?, ?, ?, ?, ?)
  `;
  
  const values = [
    insuranceData.clientId,
    insuranceData.insuranceProvider,
    insuranceData.primaryPlanName,
    insuranceData.certificateId,
    insuranceData.coverateDetail,
    insuranceData.startDate,
    insuranceData.endDate
  ];

  connection.query(query, values, (err, results) => {
    if (err) {
      return callback(err);
    }
    // Fetch the newly created insurance info
    const getInsuranceQuery = "SELECT * FROM InsuranceInfo WHERE insuranceInfoId = ?";
    connection.query(getInsuranceQuery, [results.insertId], (err, insuranceResults) => {
      if (err) {
        return callback(err);
      }
      callback(null, insuranceResults[0]);
    });
  });
};

// Function to get insurance info by clientId
const getInsuranceInfoByClientId = (clientId, callback) => {
  const query = "SELECT * FROM InsuranceInfo WHERE clientId = ?";
  connection.query(query, [clientId], callback);
};

// Function to update insurance info by insuranceInfoId
const updateInsuranceInfoById = (insuranceInfoId, insuranceData, callback) => {
  const fields = [];
  const values = [];

  // Dynamically create the query
  Object.keys(insuranceData).forEach((key) => {
    if (insuranceData[key] !== undefined) {
      fields.push(`${key} = ?`);
      values.push(insuranceData[key]);
    }
  });

  const query = `UPDATE InsuranceInfo SET ${fields.join(", ")} WHERE insuranceInfoId = ?`;
  values.push(insuranceInfoId);  // Add insuranceInfoId at the end

  connection.query(query, values, callback);
};

// Function to delete insurance info by insuranceInfoId
const deleteInsuranceInfoById = (insuranceInfoId, callback) => {
  const query = "DELETE FROM InsuranceInfo WHERE insuranceInfoId = ?";
  connection.query(query, [insuranceInfoId], callback);
};

// Function to get insurance info by insuranceInfoId
const getInsuranceInfoById = (insuranceInfoId, callback) => {
  const query = "SELECT * FROM InsuranceInfo WHERE insuranceInfoId = ?";
  connection.query(query, [insuranceInfoId], (err, results) => {
    if (err) {
      return callback(err);
    }
    callback(null, results[0]);
  });
};

module.exports = {
  getAllInsuranceInfo,
  createInsuranceInfo,
  getInsuranceInfoByClientId,
  updateInsuranceInfoById,
  deleteInsuranceInfoById,
  getInsuranceInfoById,
};
