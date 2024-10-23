const bcrypt = require("bcrypt");
const connection = require("../configs/db");

// Function to create a new user
const createUser = async (user, callback) => {
  try {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    const query = `
      INSERT INTO users (
        firstName, lastName, email, password, phoneNumber, address, postalCode, city, province, SIN, rate, isAdmin, isOutsideProvider,
        agency, beneficiary, licencingCollege, registrationNumber, contractStartDate, contractEndDate, resetPasswordToken, resetPasswordExpires,
        captchaCode, role
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const values = [
      user.firstName,
      user.lastName,
      user.email,
      hashedPassword,
      user.phoneNumber,
      user.address,
      user.postalCode,
      user.city,
      user.province,
      user.SIN,
      user.rate,
      user.isAdmin,
      user.isOutsideProvider,
      user.agency,
      user.beneficiary || null,
      user.licencingCollege || null,
      user.registrationNumber || null,
      user.contractStartDate,
      user.contractEndDate,
      user.resetPasswordToken || null,
      user.resetPasswordExpires || null,
      user.captchaCode || null,
      user.role,
    ];

    connection.query(query, values, callback);
  } catch (error) {
    callback(error);
  }
};

// Function to retrieve all users
const getAllUsers = (callback) => {
  const query = "SELECT * FROM users";
  connection.query(query, callback);
};

// Function to get a user by email
const getUserByEmail = (email, callback) => {
  const query = "SELECT * FROM users WHERE email = ?";
  connection.query(query, [email], callback);
};

// Function to get a user by userId
const getUserById = (userId) => {
  return new Promise((resolve, reject) => {
    const query = "SELECT * FROM users WHERE userId = ?";
    
    connection.query(query, [userId], (err, results) => {
      if (err) return reject(err); 

      resolve(results.length ? results[0] : null); 
    });
  });
};


// Function to update a user by userId
const updateUserById = async (userId, user, isAdminUpdate, callback) => {
  try {
    let fields = [];
    let values = [];

    // Build the query based on provided fields
    if (user.firstName && isAdminUpdate) {
      fields.push("firstName = ?");
      values.push(user.firstName);
    }

    if (user.lastName && isAdminUpdate) {
      fields.push("lastName = ?");
      values.push(user.lastName);
    }

    if (user.email && isAdminUpdate) {
      fields.push("email = ?");
      values.push(user.email);
    }

    if (user.password) {
      const hashedPassword = await bcrypt.hash(user.password, 10);
      fields.push("password = ?");
      values.push(hashedPassword);
    }

    if (user.phoneNumber) {
      fields.push("phoneNumber = ?");
      values.push(user.phoneNumber);
    }

    if (user.address) {
      fields.push("address = ?");
      values.push(user.address);
    }

    if (user.postalCode) {
      fields.push("postalCode = ?");
      values.push(user.postalCode);
    }

    if (user.city) {
      fields.push("city = ?");
      values.push(user.city);
    }

    if (user.province) {
      fields.push("province = ?");
      values.push(user.province);
    }

    if (user.isAdmin !== undefined && isAdminUpdate) {
      fields.push("isAdmin = ?");
      values.push(user.isAdmin ? 1 : 0);
    }

    if (user.role && isAdminUpdate) {
      fields.push("role = ?");
      values.push(user.role);
    }

    // If no fields to update, return an error
    if (fields.length === 0) {
      return callback(new Error("No fields to update"));
    }

    // Build the query string
    const query = `UPDATE users SET ${fields.join(", ")} WHERE userId = ?`;
    values.push(userId);

    connection.query(query, values, callback);
  } catch (error) {
    callback(error);
  }
};

// Function to update user by email
const updateUserByEmail = (email, updates, callback) => {
  const fields = Object.keys(updates)
    .map((field) => `${field} = ?`)
    .join(", ");
  const values = [...Object.values(updates), email];
  const query = `UPDATE users SET ${fields} WHERE email = ?`;
  connection.query(query, values, callback);
};

// Function to delete a user by userId
const deleteUserById = (userId, callback) => {
  const query = "DELETE FROM users WHERE userId = ?";
  connection.query(query, [userId], callback);
};

// Function to get the password by userId
const getPasswordByUserId = (userId, callback) => {
  const query = "SELECT password FROM users WHERE userId = ?";
  connection.query(query, [userId], callback);
};

module.exports = {
  createUser,
  getAllUsers,
  getUserByEmail,
  getPasswordByUserId,
  getUserById,
  updateUserById,
  deleteUserById,
  updateUserByEmail,
};
