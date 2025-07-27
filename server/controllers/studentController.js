const { User, Student } = require("../models/User");
const Payment = require("../models/Payment");
const bcrypt = require("bcryptjs");
const ShiftFee = require("../models/ShiftFee");
const jwt = require("jsonwebtoken");
const { generateToken, generateRefreshToken } = require("../utils/jwtUtils");

const {
  getCurrentAcademicYear,
  calculateTotalPaid,
  calculatePaymentStatus,
} = require("../utils/helper");

module.exports = {
  // Student Sign Up
  signUp: async (req, res) => {
    try {
      // 1. Parse and validate addresses
      let residentialAddress;
      try {
        residentialAddress =
          typeof req.body.residential === "string"
            ? JSON.parse(req.body.residential)
            : req.body.residential;
      } catch (e) {
        throw new Error("Invalid residential address format");
      }

      // 2. Handle permanent address
      let permanentAddress = residentialAddress;
      if (req.body.isPermanentSame !== "true") {
        try {
          permanentAddress =
            typeof req.body.permanent === "string"
              ? JSON.parse(req.body.permanent)
              : req.body.permanent;
        } catch (e) {
          throw new Error("Invalid permanent address format");
        }
      }
      const user = await Student.findOne({
        email: req.body.email,
        "aadhar.aadhaar": req.body.aadhaar, // Note the nested path
      }).select("+password +loginHistory");
      console.log("here", user);
      if (user) {
        return res.status(401).json({ error: "user allready registor" });
      }

      // 3. Prepare complete student data
      const studentData = {
        name: req.body.name,
        fatherName: req.body.fatherName,
        dob: new Date(req.body.dob),
        gender: req.body.gender,
        email: req.body.email.toLowerCase().trim(),
        phone: req.body.phone,
        password: req.body.password, // Will be hashed by pre-save hook
        role: "student",
        school: req.body.school,
        profileImage: req.files?.profileImage?.[0]?.path,
        aadhar: {
          aadhaar: req.body.aadhaar,
          frontImage: req.files?.frontAadhaar?.[0]?.path,
          backImage: req.files?.backAadhaar?.[0]?.path,
        },
        address: {
          residential: residentialAddress,
          permanent: permanentAddress,
        },
        isPermanentSame: req.body.isPermanentSame === "true",
      };

      // 4. Create student - NOTE: Use the correct model name (Student)
      const student = await Student.create(studentData);
      console.log("Student Data Being Created:", studentData);

      // 5. Generate token
      const token = jwt.sign(
        { userId: student._id, role: student.role },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 6. Respond with success (remove sensitive data)
      res.status(201).json({
        success: true,
        token,
        student: {
          _id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
        },
      });
    } catch (error) {
      console.error("Student Creation Error:", error);

      // Enhanced error handling
      let statusCode = 400;
      let errorMessage = error.message;

      if (error.name === "ValidationError") {
        statusCode = 422;
        errorMessage = Object.values(error.errors)
          .map((val) => val.message)
          .join(", ");
      } else if (error.code === 11000) {
        statusCode = 409;
        errorMessage = "Email or phone already exists";
      }

      res.status(statusCode).json({
        success: false,
        error: errorMessage,
        ...(process.env.NODE_ENV === "development" && {
          details: error.errors || error.stack,
        }),
      });
    }
  },
  // Student Sign In
  signIn: async (req, res) => {
    try {
      const { email, password } = req.body;
      // console.log("from the student sign Controller");

      // Validation
      if (!email || !password) {
        return res.status(400).json({
          success: false,
          error: "Email and password are required",
        });
      }
      const student = await Student.findOne({
        email: email.toLowerCase().trim(),
      }).select("+password +failedAttempts +lastFailedAttempt +isActive");

      // Account lock check
      if (student?.failedAttempts >= 5) {
        const lockoutTime = 30 * 60 * 1000;
        const timeSinceLastAttempt =
          Date.now() - new Date(student.lastFailedAttempt).getTime();
        if (timeSinceLastAttempt < lockoutTime) {
          return res.status(429).json({
            success: false,
            error: `Account locked. Try again in ${Math.ceil(
              (lockoutTime - timeSinceLastAttempt) / 60000
            )} minutes`,
          });
        }
      }
      const isMatch = await bcrypt.compare(password, student.password);
      console.log(isMatch);
      if (!isMatch) {
        await Student.updateOne(
          { _id: student?._id },
          {
            $inc: { failedAttempts: 1 },
            $set: { lastFailedAttempt: new Date() },
          }
        );
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }
      if (!student.isActive) {
        return res.status(401).json({
          success: false,
          message: "You are not verify by the Admin",
        });
      }
      // Successful login
      const token = generateToken(student);

      await Student.updateOne(
        { _id: student._id },
        {
          $unset: { failedAttempts: 1, lastFailedAttempt: 1 },
          $set: { lastLogin: new Date() },
        }
      );
      // Response structure matches client expectation
      return res.json({
        success: true,
        user: {
          id: student._id,
          name: student.name,
          email: student.email,
          role: student.role,
          profileImage: student.profileImage,
        },
        token,
      });
    } catch (error) {
      console.error("Auth error:", error);
      return res.status(500).json({
        success: false,
        error: "Authentication failed",
      });
    }
  },
  signOut: async (req, res) => {
    try {
      // Clear the HTTP-only cookie
      res.clearCookie("authToken", {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
      });

      return res.json({
        success: true,
        message: "Successfully logged out",
      });
    } catch (error) {
      console.error("Logout error:", error);
      return res.status(500).json({
        success: false,
        error: "Logout failed",
      });
    }
  },

  // Chat with Admin
  getChatMessages: async (req, res) => {
    try {
      const messages = await Chat.find({
        $or: [{ sender: req.user.id }, { receiver: req.user.id }],
      }).sort("createdAt");

      res.json({
        success: true,
        messages,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: error.message,
      });
    }
  },

  sendMessage: async (req, res) => {
    try {
      const message = await Chat.create({
        sender: req.user.id,
        receiver: req.body.adminId, // Assuming you send adminId in request
        message: req.body.message,
      });

      res.status(201).json({
        success: true,
        message,
      });
    } catch (error) {
      res.status(400).json({
        success: false,
        error: error.message,
      });
    }
  },
};
