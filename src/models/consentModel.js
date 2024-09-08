const connection = require("../configs/db");

const createConsent = (consent, callback) => {
	const query = 'INSERT INTO consent (consentId, clientId, permission, roles, receivedDate, withdrawDate) VALUES (?,?,?,?,?,?)';
	const values = [consent.consentId, consent.clientId, consent.permission, consent.roles, consent.receivedDate, consent.withdrawDate];
	
	connection.query(query, values, callback);
};

const getConsentByID = (consentId, callback) => {
	const query = 'SELECT * FROM consent WHERE consentId = ?';
	
	connection.query(query, [consentId], callback);
};

const deleteConsentByID = (consentId, callback) => {
	const query = 'DELETE FROM consent WHERE consentId = ?';
	connection.query(query, [consentId], callback);
};

const updateByConsentID = (consentId, consent, callback) => {
	const query = 'UPDATE consent SET clientId = ?, permission = ?, roles = ?, receivedDate = ?, withdrawDate = ? WHERE consentId = ?';
	const values = [consent.clientId, consent.permission, consent.roles, consent.receivedDate, consent.withdrawDate, consentId];
		
	connection.query(query, values, callback);
};

const getAllConsent = (callback) => {
	const query = 'SELECT * FROM consent';
	connection.query(query, callback);
};

module.exports = {
	createConsent,
	getConsentByID,
	deleteConsentByID,
	updateByConsentID,
	getAllConsent
};
