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
  const createUserTableQuery = `
    CREATE TABLE IF NOT EXISTS users (
      userId INT AUTO_INCREMENT PRIMARY KEY,
      firstName VARCHAR(50) NOT NULL,
      lastName VARCHAR(50) NOT NULL,
      email VARCHAR(100) NOT NULL UNIQUE,
      password VARCHAR(255) NOT NULL,
      phoneNumber VARCHAR(20) NOT NULL,
      address VARCHAR(100) NOT NULL,
      postalCode VARCHAR(10) NOT NULL,
      city VARCHAR(50) NOT NULL,
      province VARCHAR(50) NOT NULL,
      SIN VARCHAR(50) NOT NULL,
      rate FLOAT NOT NULL, 
      isAdmin TINYINT(1) NOT NULL,
      isOutsideProvider TINYINT(1) NOT NULL,
      agency VARCHAR(50) NOT NULL,
      beneficiary VARCHAR(50),
      licencingCollege VARCHAR(50),
      registrationNumber VARCHAR(50),
      contractStartDate Date NOT NULL,
      contractEndDate Date NOT NULL,
      resetPasswordToken VARCHAR(255),
      resetPasswordExpires DATETIME,
      captchaCode VARCHAR(6),
      role VARCHAR(50) NOT NULL,
      fileId INT,
      FOREIGN KEY (fileId) REFERENCES files(fileId) ON DELETE CASCADE
    );
    `;

  connection.query(createUserTableQuery, (err, results) => {
    if (err) {
      return err;
    }
    console.log("Users table is created.");
  });

  // Create ExistingClient table
  const createExistingClientTableQuery = `
  CREATE TABLE IF NOT EXISTS ExistingClient (
    clientId INT AUTO_INCREMENT PRIMARY KEY,
    psNote VARCHAR(200),
    firstName VARCHAR(50) NOT NULL,
    lastName VARCHAR(50) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    birthDate DATE NOT NULL,
    address VARCHAR(100) NOT NULL,
    city VARCHAR(50) NOT NULL,
    province VARCHAR(50) NOT NULL,
    postalCode VARCHAR(10) NOT NULL,
    phoneNumber VARCHAR(20) NOT NULL,
    email VARCHAR(100) NOT NULL,
    diagnosisId VARCHAR(100),
    school VARCHAR(50) NOT NULL,
    age INT,
    currentStatus BOOLEAN,
    fscdIdNum VARCHAR(20),
    contractId INT NOT NULL,
    guardianId INT NOT NULL,
    insuranceInfoId INT,
    consentId INT,
    teamMemberId INT,
    grade VARCHAR(10)
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
    CREATE TABLE IF NOT EXISTS clientContract (
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

  // Create contract table after ExistingClient is created
  const createFileTableQuery = `
      CREATE TABLE IF NOT EXISTS files (
        fileId INT AUTO_INCREMENT PRIMARY KEY,
        clientId INT NOT NULL,
        urlId VARCHAR(255) NOT NULL,
        fileName VARCHAR(50),
        filePath VARCHAR(255),
        fileSize INT,
        fileType VARCHAR(50),
        createdAt TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
      );
      `;

  connection.query(createFileTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating Contract table:", err);
      return;
    }
    console.log("Contract table is created.");
  });

  // Create TeamMember table to establish a many-to-many relationship between users and clients
  const createTeamMemberTableQuery = `
CREATE TABLE IF NOT EXISTS TeamMember (
  teamMemberId INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  userId INT NOT NULL,
  schedule VARCHAR(100),
  FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
  FOREIGN KEY (userId) REFERENCES users(userId) ON DELETE CASCADE
);
`;

  connection.query(createTeamMemberTableQuery, (err, results) => {
    if (err) {
      console.error("Error creating TeamMember table:", err);
      return;
    }
    console.log("TeamMember table is created.");
  });
});

// create Primary Guardian Table
const createPrimaryGuardianTableQuery = `
CREATE TABLE IF NOT EXISTS PrimaryGuardian (
  guardianId INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT NOT NULL,
  custody VARCHAR(100) NOT NULL,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  relationship VARCHAR(50),
  phoneNumber VARCHAR(20),
  email VARCHAR(100) NOT NULL,
  address VARCHAR(100),
  city VARCHAR(50),
  province VARCHAR(50),
  postalCode VARCHAR(10),
  FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
);
`;

connection.query(createPrimaryGuardianTableQuery, (err, results) => {
if (err) {
  console.error("Error creating PrimaryGuardian table:", err);
  return;
}
console.log("PrimaryGuardian table is created.");
});

/*
const insertUserQuery = `
  INSERT INTO users (
    firstName, lastName, email, password, phoneNumber, address, postalCode, city, province, SIN, rate, isAdmin, isOutsideProvider, agency, beneficiary, licencingCollege, registrationNumber, contractStartDate, contractEndDate, role, fileId
  ) VALUES (
    'Chi-Lun', 'Huang', 'th0099666@gmail.com', '12345', '4033332390', '533 14Ave Ne', 'T2E 1E8', 'Calgary', 'AB', '123456789', 20, 1, 0, 'Bridging Abilities', 'Brother', '', '', '2024-02-29', '2025-03-01', 'Aide', NULL
  );
`;

connection.query(insertUserQuery, (err, results) => {
  if (err) {
    console.error('Error inserting user:', err);
    return;
  }
  console.log('User inserted successfully:', results);
});
*/


module.exports = connection;
