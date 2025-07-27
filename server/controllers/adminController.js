const { Admin, User, Student } = require("../models/User");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const ShiftFee = require("../models/ShiftFee");
const Payment = require("../models/Payment");
const mongoose = require("mongoose");
// controllers/authController.js

module.exports = {
  adminSignUp: async (req, res) => {
    try {
      const {
        name,
        email,
        phone,
        password,
        role,
        gender,
        aadhaar,
        permissions,
        designation,
        department,
      } = req.body;

      // 2. Parse address data
      let residentialAddress;
      try {
        residentialAddress =
          typeof req.body.residential === "string"
            ? JSON.parse(req.body.residential)
            : req.body.residential;
      } catch (e) {
        throw new Error("Invalid residential address format");
      }

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

      // 3. Parse permissions
      let parsedPermissions = {};
      try {
        parsedPermissions =
          typeof permissions === "string"
            ? JSON.parse(permissions)
            : permissions;
      } catch (e) {
        return res.status(400).json({
          success: false,
          error: "Invalid permissions format",
        });
      }

      // 4. Check for existing admin
      const existingAdmin = await Admin.findOne({ email });
      console.log("check exiting user", existingAdmin);
      if (existingAdmin) {
        return res.status(409).json({
          success: false,
          error: "Admin already exists with this email",
        });
      }

      // 5. Create new admin
      const newAdmin = new Admin({
        name,
        email,
        phone,
        password,
        role,
        gender,
        aadhar: {
          aadhaar,
          frontImage: req.files?.frontAadhaar?.[0]?.path,
          backImage: req.files?.backAadhaar?.[0]?.path,
        },
        address: {
          residential: residentialAddress,
          permanent: permanentAddress,
        },
        profileImage: req.files?.profileImage?.[0]?.path,
        permissions: {
          canManagestudents: parsedPermissions.canManageStudents || false,
          canManagePayments: parsedPermissions.canManagePayments || false,
          canManageadmins: parsedPermissions.canManageAdmins || false,
          allowedDepartments: parsedPermissions.allowedDepartments || [],
        },
        designation:
          designation && designation !== "undefined" ? designation : undefined,
        department:
          department && department !== "undefined" ? department : undefined,
        isActive: true,
      });

      // 6. Save admin
      await newAdmin.save();

      // 7. Generate JWT token
      const token = jwt.sign(
        {
          userId: newAdmin._id,
          role: newAdmin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 8. Return response
      res.status(201).json({
        success: true,
        data: {
          _id: newAdmin._id,
          name: newAdmin.name,
          email: newAdmin.email,
          role: newAdmin.role,
          permissions: newAdmin.permissions,
          designation: newAdmin.designation,
          department: newAdmin.department,
        },
        token,
      });
    } catch (error) {
      console.error("Admin signup error:", error);

      // Handle validation errors
      if (error.name === "ValidationError") {
        const errors = Object.values(error.errors).map((err) => err.message);
        return res.status(400).json({
          success: false,
          error: errors.join(", "),
        });
      }

      res.status(500).json({
        success: false,
        error: "Server error during admin registration",
      });
    }
  },
  adminSignIn: async (req, res) => {
    try {
      const { email, password, userType } = req.body;
      const role = userType;
      const admin = await Admin.findOne({ email, role }).select("+password");
      if (!admin) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // 2. Verify password
      const isMatch = await bcrypt.compare(password, admin.password);
      if (!isMatch) {
        return res.status(401).json({
          success: false,
          error: "Invalid credentials",
        });
      }

      // 3. Check if account is active
      if (!admin.isActive) {
        return res.status(403).json({
          success: false,
          error: "Account not activated. Please contact super-admin.",
        });
      }

      // 4. Generate JWT token
      const token = jwt.sign(
        {
          userId: admin._id,
          role: admin.role,
        },
        process.env.JWT_SECRET,
        { expiresIn: "7d" }
      );

      // 6. Set HTTP-only cookie (optional)
      res.cookie("adminToken", token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === "production",
        maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
      });

      // 7. Send response
      res.status(200).json({
        success: true,
        user: {
          id: admin._id,
          name: admin.name,
          email: admin.email,
          role: admin.role,
          permissions: admin?.permissions,
          designation: admin?.designation,
          department: admin?.department,
          profileImage: admin.profileImage,
          isActive: admin.isActive,
        },
        token,
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        error: "Server error during sign-in",
      });
    }
  },
  createShiftFee: async (req, res) => {
    try {
      const { shift, fee, academicYear, isActive } = req.body;
      const { studentId } = req.query;

      // Validate student exists and is actually a student
      const student = await Student.findById(studentId);
      if (!student || student.role !== "student") {
        return res.status(404).json({ error: "Student not found" });
      }

      // Create the shift fee record
      const savedFee = await ShiftFee.create({
        student: studentId,
        shift: shift.toLowerCase(),
        fee,
        academicYear,
        isActive: isActive !== false, // default to true if not specified
        lastUpdatedBy: req.user.userId,
      });

      // Update the student's feeRecords with the actual fee ID
      await Student.findByIdAndUpdate(
        studentId,
        {
          $addToSet: { feeRecords: savedFee._id },
          ...(isActive !== undefined && { isActive }),
        },
        { new: true }
      );

      res.status(201).json({
        success: true,
        data: savedFee,
      });
    } catch (err) {
      console.error("Error:", err);
      res.status(400).json({
        success: false,
        error: err.message,
      });
    }
  },
  updateShiftFee: async (req, res) => {
    try {
      validateAdmin(req.user);

      const { id } = req.params;
      const updates = Object.keys(req.body);
      const allowedUpdates = ["shift", "fee", "academicYear", "isActive"];
      const isValidUpdate = updates.every((update) =>
        allowedUpdates.includes(update)
      );

      if (!isValidUpdate) {
        return res.status(400).json({ error: "Invalid updates!" });
      }

      const shiftFee = await ShiftFee.findById(id);
      if (!shiftFee) {
        return res.status(404).json({ error: "Shift fee not found" });
      }

      updates.forEach((update) => (shiftFee[update] = req.body[update]));
      shiftFee.lastUpdatedBy = req.user._id;

      await shiftFee.save();
      res.json(shiftFee);
    } catch (err) {
      res.status(400).json({ error: err.message });
    }
  },
  deleteStudent: async (req, res) => {
    try {
      const { userId } = req.query;
      const student = await Student.findById(userId);
      const shiftFee = await ShiftFee.findOne({ student: userId });
      if (!student) {
        return res.status(404).json({
          success: false,
          message: "Student not found",
        });
      }

      const session = await mongoose.startSession();
      session.startTransaction();

      try {
        // Delete student record
        await Student.deleteOne({ userId }).session(session);

        // Optionally delete associated user account
        await User.deleteOne({ _id: userId }).session(session);
        await ShiftFee.deleteOne({ student: userId });
        await session.commitTransaction();

        res.status(200).json({
          success: true,
          message: "Student deleted successfully",
          deletedId: userId,
        });
      } catch (transactionError) {
        await session.abortTransaction();
        throw transactionError;
      } finally {
        session.endSession();
      }
    } catch (error) {
      console.error("Delete student error:", error);

      res.status(500).json({
        success: false,
        message: error.message || "Failed to delete student",
        error: process.env.NODE_ENV === "development" ? error.stack : undefined,
      });
    }
  },
  getDashboardStats: async (req, res) => {
    try {
      const totalStudents = await Student.countDocuments();
      const oneWeekAgo = new Date();
      oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
      const recentPayments = await Payment.countDocuments({
        paymentDate: { $gte: oneWeekAgo },
      });

      // 3. Total Departments
      // const totalDepartments = await Department.countDocuments();

      // 4. Weekly Student Growth
      const currentWeekStudents = await Student.countDocuments({
        createdAt: { $gte: oneWeekAgo },
      });

      const previousWeekStudents = await Student.countDocuments({
        createdAt: {
          $gte: new Date(new Date().setDate(oneWeekAgo.getDate() - 7)),
          $lt: oneWeekAgo,
        },
      });

      const studentGrowth =
        previousWeekStudents > 0
          ? (
              ((currentWeekStudents - previousWeekStudents) /
                previousWeekStudents) *
              100
            ).toFixed(1)
          : 100;

      // 5. Weekly Payment Growth
      const previousWeekPayments = await Payment.countDocuments({
        paymentDate: {
          $gte: new Date(new Date().setDate(oneWeekAgo.getDate() - 7)),
          $lt: oneWeekAgo,
        },
      });

      const paymentGrowth =
        previousWeekPayments > 0
          ? (
              ((recentPayments - previousWeekPayments) / previousWeekPayments) *
              100
            ).toFixed(1)
          : 100;

      // 6. Total Payments Amount (last week)
      const totalPaymentsAmount = await Payment.aggregate([
        {
          $match: { paymentDate: { $gte: oneWeekAgo } },
        },
        {
          $group: {
            _id: null,
            total: { $sum: "$amount" },
          },
        },
      ]);

      res.status(200).json({
        success: true,
        data: {
          totalStudents,
          recentPayments,
          studentGrowth,
          paymentGrowth,
          totalPaymentsAmount: totalPaymentsAmount[0]?.total || 0,
        },
      });
    } catch (error) {
      res.status(500).json({
        success: false,
        message: error.message,
      });
    }
  },
};
