// src/models/waitlistClientModel.js
const connection = require('../configs/db');

const waitlistClientModel = {
  createWaitlistClient: (data, callback) => {
    const query = `
      INSERT INTO waitlistClient (
        clientId, datePlaced, dateContact, dateServiceOffered, dateStartedService,
        community, fundingSources, serviceNeeded, consultHistory, dateConsultationBooked,
        firstName, lastName, gender, birthDate, address, postalCode, phoneNumber, email,
        diagnosis, school, age, fscdIdNum, caseWorkerName, serviceType,
        serviceProvidersNeeded, availability, locationOfService, feesDiscussed,
        followUp, referralFrom, previousService, paperworkDeadline, nextMeetingDate,
        concerns, isArchived
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?) 
    `;
//35 fileds
    const values = [
      data.datePlaced,
      data.dateContact,
      data.dateServiceOffered,
      data.dateStartedService,
      data.community,
      data.fundingSources,
      data.serviceNeeded,
      data.consultHistory,
      data.dateConsultationBooked,
      data.firstName,
      data.lastName,
      data.gender,
      data.birthDate,
      data.address,
      data.postalCode,
      data.phoneNumber,
      data.email,
      data.diagnosis,
      data.school,
      data.age,
      data.fscdIdNum,
      data.caseWorkerName,
      data.serviceType,
      data.serviceProvidersNeeded,
      data.availability,
      data.locationOfService,
      data.feesDiscussed,
      data.followUp,
      data.referralFrom,
      data.previousService,
      data.paperworkDeadline,
      data.nextMeetingDate,
      data.concerns,
      data.isArchived,
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
        clientId = ?, datePlaced = ?, dateContact = ?, dateServiceOffered = ?, dateStartedService = ?,
        community = ?, fundingSources = ?, serviceNeeded = ?, consultHistory = ?, dateConsultationBooked = ?,
        firstName = ?, lastName = ?, gender = ?, birthDate = ?, address = ?, postalCode = ?, phoneNumber = ?, email = ?,
        diagnosis = ?, school = ?, age = ?, fscdIdNum = ?, caseWorkerName = ?, serviceType = ?,
        serviceProvidersNeeded = ?, availability = ?, locationOfService = ?, feesDiscussed = ?,
        followUp = ?, referralFrom = ?, previousService = ?, paperworkDeadline = ?, nextMeetingDate = ?,
        concerns = ?, isArchived = ?
      WHERE waitlistClientId = ?
    `;

    const values = [
      data.clientId,
      data.datePlaced,
      data.dateContact,
      data.dateServiceOffered,
      data.dateStartedService,
      data.community,
      data.fundingSources,
      data.serviceNeeded,
      data.consultHistory,
      data.dateConsultationBooked,
      data.firstName,
      data.lastName,
      data.gender,
      data.birthDate,
      data.address,
      data.postalCode,
      data.phoneNumber,
      data.email,
      data.diagnosis,
      data.school,
      data.age,
      data.fscdIdNum,
      data.caseWorkerName,
      data.serviceType,
      data.serviceProvidersNeeded,
      data.availability,
      data.locationOfService,
      data.feesDiscussed,
      data.followUp,
      data.referralFrom,
      data.previousService,
      data.paperworkDeadline,
      data.nextMeetingDate,
      data.concerns,
      data.isArchived,
      id,
    ];

    connection.query(query, values, callback);
  },

  deleteWaitlistClient: (id, callback) => {
    const query = 'DELETE FROM waitlistClient WHERE waitlistClientId = ?';
    connection.query(query, [id], callback);
  },
};

module.exports = waitlistClientModel;
