const app = require('./app');
const http = require('http');
require('dotenv').config();


// const createInitialAdmin = async () => {
//   try {
//     const [rows] = await connection.query('SELECT * FROM users WHERE isAdmin = 1');
//     if (rows.length === 0 && process.env.CREATE_ADMIN_ON_STARTUP) {
//       const hashedPassword = await bcrypt.hash(process.env.ADMIN_PASSWORD, 10);
//       const query = `
//         INSERT INTO users (firstName, lastName, email, password, phoneNumber, address, postalCode, city, province, SIN, rate, isAdmin, isOutsideProvider, agency, role)
//         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
//       `;
//       const values = [
//         'Admin', 'User', process.env.ADMIN_EMAIL, hashedPassword, '555-0000', '123 Admin St',
//         '12345', 'AdminCity', 'AdminProvince', '123-456-789', 100.0, 1, 0, 'Admin Agency', 'Therapist'
//       ];

//       connection.query(query, values, (error) => {
//         if (error) {
//           console.error('Error creating admin user:', error);
//         } else {
//           console.log('Admin user created successfully.');
//         }
//       });
//     }
//   } catch (error) {
//     console.error('Error creating initial admin:', error);
//   }
// };

// createInitialAdmin();


const PORT = process.env.PORT || 8000;

const server = http.createServer(app);

server.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});