// src/routes/waitlistClientRoutes.js
const express = require('express');
const router = express.Router();
const waitlistClientController = require('../controllers/waitlistClientController');

// Create a new waitlist client
router.post('/createWaitlistClient', waitlistClientController.createWaitlistClient);

// Get all waitlist clients
router.get('/getAllWaitlistClient', waitlistClientController.getAllWaitlistClients);

// Get a specific waitlist client by ID
router.get('/getWaitlistClient/:id', waitlistClientController.getWaitlistClientById);

// Update a waitlist client
router.put('/updateWaitlistClient/:id', waitlistClientController.updateWaitlistClient);

// Delete a waitlist client
router.delete('/deleteWaitlistClient/:id', waitlistClientController.deleteWaitlistClient);

module.exports = router;
