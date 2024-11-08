// src/models/waitlistClientModel.js
const connection = require('../configs/db');

const waitlistClientModel = {
  createWaitlistClient: (data, callback) => {
    const query = `
      INSERT INTO waitlistClient (
        datePlaced, dateContact, dateServiceOffered, dateStartedService,
        community, fundingSources, serviceProvidersNeeded, consultHistory, dateConsultationBooked,
        firstName, lastName, gender, birthDate, address, postalCode, province, city, phoneNumber, email,
        diagnosis, school, fscdIdNum, caseWorkerName, serviceType,
        availability, locationOfService, feeDiscussed,
        followUp, referralFrom, previousService, paperworkDeadline, nextMeetingDate,
        concerns, pets, parentName, language, siblings, hasConverted, isArchived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      data.datePlaced,
      data.dateContact,
      data.dateServiceOffered,
      data.dateStartedService,
      data.community,
      data.fundingSources,
      data.serviceProvidersNeeded,
      data.consultationHistory, // Changed from data.consultHistory
      data.dateConsultationBooked,
      data.firstName,
      data.lastName,
      data.gender,
      data.birthDate,
      data.address,
      data.postalCode,
      data.province,
      data.city,
      data.phoneNumber,
      data.email,
      data.diagnosis,
      data.school,
      data.fscdIdNum,
      data.caseWorkerName,
      data.serviceType,
      data.availability,
      data.locationOfService,
      data.feeDiscussed, // Corrected from data.feesDiscussed
      data.followUp,
      data.referralFrom,
      data.previousService,
      data.paperworkDeadline,
      data.nextMeetingDate,
      data.concerns,
      data.pets, // Added
      data.parentName, // Added
      data.language, // Added
      data.siblings, // Added
      data.hasConverted, // Added
      data.isArchived
    ];

    connection.query(query, values, callback);
  },

  getAllWaitlistClients: (callback) => {
    const query = 'SELECT * FROM waitlistClient';
    connection.query(query, callback);
  },

  getWaitlistClientById: (id, callback) => {
    const query = 'SELECT * FROM waitlistClient WHERE waitlistClientId = ?';
    connection.query(query, [id], callback);
  },

  updateWaitlistClient: (id, data, callback) => {
    const query = `
      UPDATE waitlistClient SET
        datePlaced = ?, dateContact = ?, dateServiceOffered = ?, dateStartedService = ?,
        community = ?, fundingSources = ?, serviceProvidersNeeded = ?, consultHistory = ?, dateConsultationBooked = ?,
        firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, postalCode = ?, province = ?, city = ?,
        phoneNumber = ?, email = ?, diagnosis = ?, school = ?, fscdIdNum = ?, caseWorkerName = ?, serviceType = ?,
        availability = ?, locationOfService = ?, feeDiscussed = ?,
        followUp = ?, referralFrom = ?, previousService = ?, paperworkDeadline = ?, nextMeetingDate = ?,
        concerns = ?, pets = ?, parentName = ?, language = ?, siblings = ?, hasConverted = ?, isArchived = ?
      WHERE waitlistClientId = ?
    `;

    const values = [
      data.datePlaced,
      data.dateContact,
      data.dateServiceOffered,
      data.dateStartedService,
      data.community,
      data.fundingSources,
      data.serviceProvidersNeeded,
      data.consultationHistory, // Changed from data.consultHistory
      data.dateConsultationBooked,
      data.firstName,
      data.lastName,
      data.gender,
      data.birthDate,
      data.address,
      data.postalCode,
      data.province,
      data.city,
      data.phoneNumber,
      data.email,
      data.diagnosis,
      data.school,
      data.fscdIdNum,
      data.caseWorkerName,
      data.serviceType,
      data.availability,
      data.locationOfService,
      data.feeDiscussed, // Corrected from data.feesDiscussed
      data.followUp,
      data.referralFrom,
      data.previousService,
      data.paperworkDeadline,
      data.nextMeetingDate,
      data.concerns,
      data.pets, // Added
      data.parentName, // Added
      data.language, // Added
      data.siblings, // Added
      data.hasConverted, // Added
      data.isArchived,
      id // Added id at the end to match the WHERE clause
    ];

    connection.query(query, values, callback);
  },

  deleteWaitlistClient: (id, callback) => {
    const query = 'DELETE FROM waitlistClient WHERE waitlistClientId = ?';
    connection.query(query, [id], callback);
  },
};

module.exports = waitlistClientModel;
