// tests/controllers/userController.test.js
const request = require("supertest");
const db = require('../../src/configs/db.js');
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const app = require("../../app");
const {
  registerUserController,
  loginUserController,
  requestPasswordReset,
  resetPassword,
} = require("../../src/controllers/authController.js");
const {
  createUser,
  getUserByEmail,
  updateUserByEmail,
} = require("../../src/models/userModel");
const sendEmail = require("../../src/utils/sendEmail.js");

afterAll(async () => {
  await db.end();
});

// Mock dependencies
jest.mock("../../src/models/userModel");
jest.mock("../../src/utils/sendEmail");

describe("User Controller", () => {
  describe("registerUserController", () => {
    it("should register a user successfully", async () => {
      const req = {
        body: {
          firstName: "John",
          lastName: "Doe",
          email: "john@example.com",
          password: "123456",
          role: "admin",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      createUser.mockImplementation((user, callback) =>
        callback(null, { id: 1, ...user })
      );

      await registerUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(201);
      expect(res.send).toHaveBeenCalledWith(
        expect.objectContaining({
          firstName: "John",
          email: "john@example.com",
        })
      );
    });

    it("should return 400 if there is an error creating user", async () => {
      const req = { body: { email: "john@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      createUser.mockImplementation((user, callback) =>
        callback(new Error("Error"))
      );

      await registerUserController(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith(new Error("Error"));
    });
  });

  describe("loginUserController", () => {
    let req, res;

    beforeEach(() => {
      req = { body: { email: "john@example.com", password: "123456" } };
      res = {
        status: jest.fn().mockReturnThis(),
        send: jest.fn(),
        json: jest.fn(),
      };
    });

    it("should login user and return token and user data", async () => {
      // Mock hashed password
      const hashedPassword = await bcrypt.hash("123456", 10);

      // Mock database call
      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [
          {
            userId: 1,
            email: "john@example.com",
            password: hashedPassword,
            isAdmin: true,
          },
        ])
      );

      // Mock bcrypt.compare to return true
      bcrypt.compare = jest.fn().mockResolvedValue(true);

      // Run the controller
      await loginUserController(req, res);

      // Verify the expected output
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          token: expect.any(String),
          user: expect.objectContaining({
            userId: 1,
            email: "john@example.com",
            isAdmin: true,
          }),
        })
      );
    });

    it("should return 401 for invalid credentials", async () => {
      // Mock hashed password
      const hashedPassword = await bcrypt.hash("123456", 10);

      // Mock getUserByEmail implementation
      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [
          {
            userId: 1,
            email: "john@example.com",
            password: hashedPassword,
          },
        ])
      );

      // Simulate bcrypt.compare returning false
      bcrypt.compare = jest.fn().mockResolvedValue(false);

      // Run the controller
      await loginUserController(req, res);

      // Validate the output
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid email or password");
    });

    it("should return 401 if user is not found", async () => {
      // Mock getUserByEmail implementation with no results
      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [])
      );

      // Run the controller
      await loginUserController(req, res);

      // Validate the output
      expect(res.status).toHaveBeenCalledWith(401);
      expect(res.send).toHaveBeenCalledWith("Invalid email or password");
    });

    it("should return 500 for server errors", async () => {
      // Mock getUserByEmail to return an error
      getUserByEmail.mockImplementation((email, callback) =>
        callback(new Error("Database error"), null)
      );

      // Run the controller
      await loginUserController(req, res);

      // Validate the output
      expect(res.status).toHaveBeenCalledWith(500);
      expect(res.send).toHaveBeenCalledWith("Internal Server Error");
    });
  });

  describe("requestPasswordReset", () => {
    it("should send a CAPTCHA code via email for password reset", async () => {
      const req = { body: { email: "john@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [{ id: 1, email }])
      );
      updateUserByEmail.mockImplementation((email, data, callback) =>
        callback(null, {})
      );
      sendEmail.mockResolvedValue(true);

      await requestPasswordReset(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.json).toHaveBeenCalledWith(
        expect.objectContaining({
          message: "A CAPTCHA code has been sent to your email address",
          email: "john@example.com",
        })
      );
    });

    it("should return 404 if email is not found", async () => {
      const req = { body: { email: "notfound@example.com" } };
      const res = { status: jest.fn().mockReturnThis(), json: jest.fn() };

      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [])
      );

      await requestPasswordReset(req, res);

      expect(res.status).toHaveBeenCalledWith(404);
      expect(res.json).toHaveBeenCalledWith({
        error: "No user found with that email",
      });
    });
  });

  describe("resetPassword", () => {
    it("should reset password successfully", async () => {
      const req = {
        body: {
          email: "john@example.com",
          newPassword: "newpassword",
          captchaCode: "123456",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [
          {
            email,
            captchaCode: "123456",
            resetPasswordExpires: new Date(Date.now() + 3600000),
          },
        ])
      );
      updateUserByEmail.mockImplementation((email, data, callback) =>
        callback(null, {})
      );

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(200);
      expect(res.send).toHaveBeenCalledWith("Password has been updated");
    });

    it("should return 400 if captcha code is invalid", async () => {
      const req = {
        body: {
          email: "john@example.com",
          newPassword: "newpassword",
          captchaCode: "wrongcode",
        },
      };
      const res = { status: jest.fn().mockReturnThis(), send: jest.fn() };

      getUserByEmail.mockImplementation((email, callback) =>
        callback(null, [
          {
            email,
            captchaCode: "123456",
            resetPasswordExpires: new Date(Date.now() + 3600000),
          },
        ])
      );

      await resetPassword(req, res);

      expect(res.status).toHaveBeenCalledWith(400);
      expect(res.send).toHaveBeenCalledWith("Invalid CAPTCHA code");
    });
  });
});
