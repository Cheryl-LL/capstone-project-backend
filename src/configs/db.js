const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

// Connect to the database
connection.connect((err) => {
  if (err) {
    console.error("Error connecting to the database:", err);
    return;
  }
  console.log("Connected to the MySQL database.");

    // Check if the user table exists and create it if it doesn't
    const createTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(20) NOT NULL,
      address VARCHAR(100) NOT NULL,
      postalCode VARCHAR(10) NOT NULL,
      city VARCHAR(50) NOT NULL,
      province VARCHAR(50) NOT NULL,
      isAdmin TINYINT(1),
      profilePicture VARCHAR(255),
      resetPasswordToken VARCHAR(255),
      resetPasswordExpires DATETIME,
      captchaCode VARCHAR(6),
      role VARCHAR(10)
    );
    `;
  
    connection.query(createTableQuery, (err, results) => {
      if (err) {
        return err;
      }
      console.log("Users table is created.");
    });

  // Create ExistingClient table
  const createExistingClientTableQuery = `
  CREATE TABLE IF NOT EXISTS ExistingClient (
    clientId INT AUTO_INCREMENT PRIMARY KEY,
    aType VARCHAR(50),
    teamMemberList VARCHAR(50),
    guardianList VARCHAR(50),
    consentList VARCHAR(200),
    insurance VARCHAR(100),
    invoice VARCHAR(50),
    psNote VARCHAR(200),
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birthDate DATE NOT NULL,
    address VARCHAR(100) NOT NULL,
    postalCode VARCHAR(10) NOT NULL,
    phone VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    diagnosis VARCHAR(100),
    school VARCHAR(50),
    age INT,
    currentStatus BOOLEAN,
    fscdIdNum VARCHAR(20),
    contractId VARCHAR(5),
    guardianId VARCHAR(5),
    insuranceInfoId VARCHAR(5),
    invoiceId VARCHAR(5),
    consentId VARCHAR(5),
    scheduleId VARCHAR(5),
    teamMemberId VARCHAR(5)
  );
  `;

  connection.query(createExistingClientTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating ExistingClient table:", err);
      return;
    }
    console.log("ExistingClient table is created.");

    // Create contract table after ExistingClient is created
    const createContractTableQuery = `
    CREATE TABLE IF NOT EXISTS contract (
      contractId INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      hourPerService INT NOT NULL,
      FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
    );
    `;
    
    connection.query(createContractTableQuery, (err, results) => {
      if (err) {
        console.error("Error creating Contract table:", err);
        return;
      }
      console.log("Contract table is created.");
    });

    // Create consent table after ExistingClient is created
    const createConsentTableQuery = `
    CREATE TABLE IF NOT EXISTS consent (
      consentId INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      permission TEXT NOT NULL,
      receivedDate DATE NOT NULL,
      withdrawDate DATE,
      FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
    );
    `;
    
    connection.query(createConsentTableQuery, (err, results) => {
      if (err) {
        console.error("Error creating Consent table:", err);
        return;
      }
      console.log("Consent table is created.");
    });

    // Create InsuranceInfo table after ExistingClient is created
    const createInsuranceInfoTableQuery = `
    CREATE TABLE IF NOT EXISTS InsuranceInfo (
      insuranceInfoId INT AUTO_INCREMENT PRIMARY KEY,
      clientId INT NOT NULL,
      insuranceProvider VARCHAR(50) NOT NULL,
      primaryPlanName VARCHAR(50) NOT NULL,
      certificateId VARCHAR(50) NOT NULL,
      coverateDetail TEXT,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
    );
    `;
    
    connection.query(createInsuranceInfoTableQuery, (err, results) => {
      if (err) {
        console.error("Error creating InsuranceInfo table:", err);
        return;
      }
      console.log("InsuranceInfo table is created.");
    });
  });
});

module.exports = connection;