
const {
    getAllInvoices,
    getInvoicesByUserId,
    getInvoiceById,
    deleteInvoiceById,
    updateInvoiceById,
    createInvoice,
  } = require("../models/invoiceModel");
  
  const getAllInvoicesController = (req, res) => {
    getAllInvoices((err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(results);
    });
  };
  
  const createInvoiceController = (req, res) => {
  
    const invoiceData = req.body;
    const loggedInUserId = req.user.id; // Use 'id' instead of 'userId'
  
    // Set the userId to the logged-in user's ID
    invoiceData.userId = loggedInUserId;
  
    // Ensure isGiven defaults to false (0)
    invoiceData.isGiven = false;
  
    // Validate required fields
    const requiredFields = ["firstName", "lastName", "month", "rate", "hours"];
    for (const field of requiredFields) {
      if (!invoiceData[field]) {
        return res.status(400).send(`Missing required field: ${field}`);
      }
    }
  
    createInvoice(invoiceData, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res
        .status(201)
        .send({ message: "Invoice created successfully", invoiceId: results.insertId });
    });
  };

  const getInvoicesByUserIdController = (req, res) => {
    const { userId } = req.params;
    const loggedInUserId = req.user.userId;
    const isAdmin = req.user.isAdmin;
  
    if (!isAdmin && parseInt(userId) !== loggedInUserId) {
      return res
        .status(403)
        .send("Access denied. You are not authorized to view these invoices.");
    }
  
    getInvoicesByUserId(userId, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      res.send(results);
    });
  };
  
  const deleteInvoiceController = (req, res) => {
    const { invoiceId } = req.params;
    const loggedInUserId = req.user.userId;
    const isAdmin = req.user.isAdmin;
  
    getInvoiceById(invoiceId, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).send("Invoice not found");
      }
  
      const invoice = results[0];
      if (!isAdmin && invoice.userId !== loggedInUserId) {
        return res
          .status(403)
          .send("Access denied. You are not authorized to delete this invoice.");
      }
  
      deleteInvoiceById(invoiceId, (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({ message: "Invoice successfully deleted" });
      });
    });
  };
  
  const updateInvoiceController = (req, res) => {
    const { invoiceId } = req.params;
    const invoiceData = req.body;
    const loggedInUserId = req.user.userId;
    const isAdmin = req.user.isAdmin;
  
    getInvoiceById(invoiceId, (err, results) => {
      if (err) {
        return res.status(500).send(err);
      }
      if (results.length === 0) {
        return res.status(404).send("Invoice not found");
      }
  
      const invoice = results[0];
      if (!isAdmin && invoice.userId !== loggedInUserId) {
        return res
          .status(403)
          .send("Access denied. You are not authorized to update this invoice.");
      }
  
      updateInvoiceById(invoiceId, invoiceData, (err, results) => {
        if (err) {
          return res.status(500).send(err);
        }
        res.send({ message: "Invoice successfully updated" });
      });
    });
  };
  
  module.exports = {
    getAllInvoicesController,
    getInvoicesByUserIdController,
    deleteInvoiceController,
    updateInvoiceController,
    createInvoiceController,
  };
  