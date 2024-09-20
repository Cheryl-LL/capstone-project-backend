const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  updateUserByIdBySelf,
} = require("../models/userModel");

const getAllUsersController = (req, res) => {
  getAllUsers((err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

const getUserByIdController = (req, res) => {
  getUserById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    if (results.length === 0) {
      return res.status(404).send("User not found");
    }
    res.send(results[0]);
  });
};

// Controller to update user by admin
const updateUserByIdByAdminController = (req, res) => {
  const userId = req.params.id;
  const { email } = req.body;

  // First, check if the user exists by ID
  getUserById(userId, (err, userResults) => {
    if (err) {
      return res.status(500).send({ error: "Database query error", err });
    }

    if (userResults.length === 0) {
      return res.status(404).send({ error: "User ID not found" });
    }

    // If the user exists, check if the email is already in use by another user
    getUserByEmail(email, (err, emailResults) => {
      if (err) {
        return res.status(500).send({ error: "Database query error", err });
      }

      if (emailResults.length > 0 && emailResults[0].id != userId) {
        return res.status(400).send({ error: "Email already exists" });
      }

      // update user by admin
      updateUserById(userId, req.body, true, (err, updateResults) => {
        if (err) {
          return res.status(400).send(err);
        }
        res.send(updateResults);
      });
    });
  });
};

// Controller to update user by self
const updateUserByIdBySelfController = (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.id;

  // Check if the logged-in user matches the user ID in the URL
  if (String(userId) !== String(loggedInUserId)) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this profile." });
  }

  // Define allowed fields for self-update
  const allowedFields = [
    "password",
    "phoneNumber",
    "address",
    "postalCode",
    "city",
    "province",
    "profilePicture",
  ];

  // Check if the user is sending more info than allowed
  const sentFields = Object.keys(req.body);
  const invalidFields = sentFields.filter(
    (field) => !allowedFields.includes(field)
  );

  if (invalidFields.length > 0) {
    return res.status(400).send({
      message: `The following fields are not allowed to be updated: ${invalidFields.join(
        ", "
      )}`,
    });
  }

  // Proceed with self-update (restricted fields)
  updateUserById(userId, req.body, false, (err, results) => {
    if (err) {
      return res.status(400).send(err);
    }
    res.send(results);
  });
};

const deleteUserByIdController = (req, res) => {
  deleteUserById(req.params.id, (err, results) => {
    if (err) {
      return res.status(500).send(err);
    }
    res.send(results);
  });
};

module.exports = {
  getAllUsersController,
  getUserByIdController,
  updateUserByIdByAdminController,
  deleteUserByIdController,
  updateUserByIdBySelfController,
};
