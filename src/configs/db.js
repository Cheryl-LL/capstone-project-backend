const mysql = require("mysql2");

// Create a connection to the database
const connection = mysql.createPool({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  waitForConnections: true, // Wait for connections when pool is full
  connectionLimit: 10, // Maximum number of connections in the pool
  queueLimit: 0,
});

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
    grade VARCHAR(50),
    currentStatus BOOLEAN,
    fscdIdNum VARCHAR(20),
    contractId INT NOT NULL,
    guardianId INT NOT NULL,
    insuranceInfoId INT,
    consentId INT,
    teamMemberId INT
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
      fileId INT NOT NULL,
      startDate DATE NOT NULL,
      endDate DATE NOT NULL,
      COOhours INT,
      PBChours INT,
      SLPhours INT,
      OThours INT,
      PThours INT,
      AIDEhours INT,
      COUShours INT,
      CARhours INT,
      FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE,
      FOREIGN KEY (fileId) REFERENCES Files(clientId) ON DELETE CASCADE
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
      permissionNote TEXT NOT NULL,
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
  startServiceDate DATE NOT NULL,
  endServiceDate DATE,
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

const createDiagnosisTableQuery = `
  CREATE TABLE IF NOT EXISTS Diagnosis (
    diagnosis VARCHAR(50) NOT NULL,
    aType TINYINT(1) NOT NULL,
    clientId INT NOT NULL,
    FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
  );
  `;

connection.query(createDiagnosisTableQuery, (err, results) => {
  if (err) {
    console.error("Error creating Diagnosis table:", err);
    return;
  }
  console.log("Diagnosis table is created.");
});

// Create waitlistClient table
const createWaitlistClientTableQuery = `
CREATE TABLE IF NOT EXISTS waitlistClient (
  waitlistClientId INT AUTO_INCREMENT PRIMARY KEY,
  clientId INT,
  datePlaced DATE NOT NULL,
  dateContact DATE NOT NULL,
  dateServiceOffered DATE,
  dateStartedService DATE,
  community VARCHAR(100),
  fundingSources VARCHAR(255),
  serviceNeeded VARCHAR(255),
  consultHistory TEXT,
  dateConsultationBooked DATE,
  firstName VARCHAR(50) NOT NULL,
  lastName VARCHAR(50) NOT NULL,
  gender VARCHAR(20),
  birthDate DATE,
  address VARCHAR(100),
  postalCode VARCHAR(10),
  phoneNumber VARCHAR(20),
  email VARCHAR(100),
  diagnosis VARCHAR(255),
  school VARCHAR(100),
  age INT,
  fscdIdNum VARCHAR(50),
  caseWorkerName VARCHAR(50),
  serviceType VARCHAR(100),
  serviceProvidersNeeded VARCHAR(255),
  availability VARCHAR(255),
  locationOfService VARCHAR(100),
  feesDiscussed VARCHAR(255),
  followUp VARCHAR(255),
  referralFrom VARCHAR(255),
  previousService VARCHAR(255),
  paperworkDeadline DATE,
  nextMeetingDate DATE,
  concerns TEXT,
  isArchived BOOLEAN NOT NULL,
  FOREIGN KEY (clientId) REFERENCES ExistingClient(clientId) ON DELETE CASCADE
);
`;

connection.query(createWaitlistClientTableQuery, (err, results) => {
  if (err) {
    console.error("Error creating waitlistClient table:", err);
    return;
  }
  console.log("waitlistClient table is created.");
});

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

// });

module.exports = connection;