const bcrypt = require("bcrypt");
const {
  getAllUsers,
  getUserById,
  updateUserById,
  deleteUserById,
  getUserByEmail,
  getPasswordByUserId,
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
const updateUserByIdBySelfController = async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.id;

  if (String(userId) !== String(loggedInUserId)) {
    return res
      .status(403)
      .send({ message: "You are not authorized to update this profile." });
  }

  const allowedFields = [
    "phoneNumber",
    "address",
    "postalCode",
    "city",
    "province",
  ];
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

  try {
    const results = await new Promise((resolve, reject) => {
      updateUserById(userId, req.body, false, (error, results) => {
        if (error) return reject(error);
        resolve(results);
      });
    });
    res.send({ message: "User updated successfully.", results });
  } catch (error) {
    res.status(500).send({ message: "Error updating user." });
  }
};

const changePasswordController = async (req, res) => {
  const userId = req.params.id;
  const loggedInUserId = req.user.id;

  // Ensure the user is updating their own password
  if (String(userId) !== String(loggedInUserId)) {
    return res
      .status(403)
      .send({ message: "You are not authorized to change this password." });
  }

  const { currentPassword, newPassword } = req.body;

  // Validate request data
  if (!currentPassword || !newPassword) {
    return res
      .status(400)
      .send({ message: "Current password and new password are required." });
  }

  try {
    // Fetch the current password from the database
    const results = await new Promise((resolve, reject) => {
      getPasswordByUserId(loggedInUserId, (error, results) => {
        if (error) {
          return reject(error);
        }
        resolve(results);
      });
    });

    if (!results || results.length === 0) {
      return res.status(404).send({ message: "User not found." });
    }

    const user = results[0];
    console.log(
      "Current Password:",
      currentPassword,
      "Stored Hashed Password:",
      user.password
    );

    // Verify the current password
    const isCurrentPasswordMatch = await bcrypt.compare(
      currentPassword,
      user.password
    );
    if (!isCurrentPasswordMatch) {
      return res
        .status(401)
        .send({ message: "Current password is incorrect." });
    }

    // Check if the new password is different from the current password
    const isNewPasswordSame = await bcrypt.compare(newPassword, user.password);
    if (isNewPasswordSame) {
      return res.status(400).send({
        message: "New password must be different from the current password.",
      });
    }

    // Call updateUserById to update the password
    const updateUser = { password: newPassword };
    updateUserById(userId, updateUser, false, (updateError) => {
      if (updateError) {
        return res
          .status(500)
          .send({ message: "Error updating password: " + updateError.message });
      }
      res.send({ message: "Password changed successfully." });
    });
  } catch (error) {
    console.error("Server error:", error);
    res.status(500).send({ message: "Server error: " + error.message });
  }
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
  changePasswordController,
};
