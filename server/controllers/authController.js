const { User, Student } = require("../models/User");
const Payment = require("../models/Payment");
const ShiftFee = require("../models/ShiftFee");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const { calculatePaymentStatus } = require("../utils/helper");
module.exports = {
  getStudents: async (req, res) => {
    try {
      const students = await Student.find()
        .sort({ createdAt: -1 })
        .select("-__v -password -refreshToken -loginHistory")
        .lean();
      const validStudentIds = students
        .map((s) => s._id)
        .filter((id) => mongoose.Types.ObjectId.isValid(id));
      if (validStudentIds.length !== students.length) {
        console.warn("Some invalid student IDs were filtered out");
      }
      const allFeeRecords = await ShiftFee.find({
        student: { $in: validStudentIds },
      })
        .populate({
          path: "payments",
          select: "amount date method receiptNumber verified",
        })
        .lean();
      // Group fee records by student
      const feeRecordsByStudent = allFeeRecords.reduce((acc, record) => {
        const studentId = record.student.toString();
        if (!acc[studentId]) {
          acc[studentId] = [];
        }
        acc[studentId].push(record);
        return acc;
      }, {});

      // Enrich each student with their fee records
      const enrichedStudents = students.map((student) => {
        const feeRecords = feeRecordsByStudent[student._id.toString()] || [];

        return {
          ...student,
          feeRecords: feeRecords.map((record) => ({
            ...record,
            balance:
              record.fee -
              (record.payments?.reduce((sum, p) => sum + p.amount, 0) || 0),
            status: calculatePaymentStatus(record.fee, record.payments || []),
          })),
          paymentHistory: feeRecords.flatMap((record) => record.payments || []),
        };
      });

      res.status(200).json({
        success: true,
        count: enrichedStudents.length,
        data: enrichedStudents,
      });
    } catch (err) {
      res.status(500).json({
        success: false,
        error: "Server Error: " + err.message,
      });
    }
  },
  getStudentData: async (req, res) => {
    try {
      const { id } = req.query;
      const student = await Student.findById(id)
        .select("-password -refreshToken -__v -updatedAt -loginHistory")
        .lean();

      if (!student) {
        return res.status(404).json({
          status: "fail",
          message: "Student not found",
        });
      }

      const feeRecords = await ShiftFee.find({ student: req.params.id })
        .populate({
          path: "payments",
          select: "amount date method receiptNumber verified",
        })
        .lean();

      const payments = await Payment.find({
        student: req.params.id,
        shiftFee: { $in: feeRecords.map((fee) => fee._id) }, // Match payments for any of the fee records
      }).lean();

      console.log(feeRecords, payments);
      res.status(200).json({
        status: "success",
        data: {
          ...student,
          payments,
          feeRecords: feeRecords.map((record) => ({
            ...record,
            balance:
              record.fee -
              record.payments.reduce((sum, p) => sum + p.amount, 0),
            status: calculatePaymentStatus(record.fee, record.payments),
          })),
        },
      });
    } catch (err) {
      res.status(500).json({
        status: "error",
        message: err.message || "Failed to fetch student data",
      });
    }
  },

  getStudentShiftFees: async (req, res) => {
    try {
      const { studentId } = req.params;
      const fees = await ShiftFee.findOne({ student: studentId });
      res.json(fees);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },
  getShiftFeeSummary: async (req, res) => {
    try {
      validateAdmin(req.user);

      const { year, shift } = req.query;
      const match = {};
      if (year) match.academicYear = year;
      if (shift) match.shift = shift.toUpperCase();

      const summary = await ShiftFee.aggregate([
        { $match: match },
        {
          $group: {
            _id: "$shift",
            totalStudents: { $sum: 1 },
            totalFees: { $sum: "$fee" },
            paidFees: {
              $sum: {
                $reduce: {
                  input: "$payments",
                  initialValue: 0,
                  in: { $add: ["$$value", "$$this.amount"] },
                },
              },
            },
          },
        },
      ]);

      res.json(summary);
    } catch (err) {
      res.status(500).json({ error: err.message });
    }
  },

  getShiftFeeSummary: async (req, res) => {
    try {
      const { year, studentId } = req.query;

      // Validate year format
      if (!year || !/^\d{4}-\d{4}$/.test(year)) {
        return res
          .status(400)
          .json({ error: "Valid academic year required (format: YYYY-YYYY)" });
      }

      const matchCriteria = {
        academicYear: year,
        isActive: true,
      };

      // Add student filter if studentId is provided
      if (studentId) {
        matchCriteria.student = mongoose.Types.ObjectId(studentId);
      }

      // Aggregate shift fee data
      const summary = await ShiftFee.aggregate([
        {
          $match: matchCriteria,
        },
        {
          $group: {
            _id: "$shift",
            totalFees: { $sum: "$fee" },
            totalStudents: { $sum: 1 },
          },
        },
        {
          $lookup: {
            from: "payments",
            let: {
              shift: "$_id",
              academicYear: year,
              student: studentId ? mongoose.Types.ObjectId(studentId) : null,
            },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $and: [
                      { $eq: ["$academicYear", "$$academicYear"] },
                      { $eq: ["$shift", "$$shift"] },
                      studentId ? { $eq: ["$student", "$$student"] } : {},
                    ],
                  },
                  status: { $in: ["completed", "partial"] },
                },
              },
              {
                $group: {
                  _id: null,
                  totalPaid: { $sum: "$amount" },
                },
              },
            ],
            as: "payments",
          },
        },
        {
          $addFields: {
            paidFees: {
              $ifNull: [{ $arrayElemAt: ["$payments.totalPaid", 0] }, 0],
            },
          },
        },
        {
          $project: {
            _id: 1,
            totalFees: 1,
            totalStudents: 1,
            paidFees: 1,
            balance: { $subtract: ["$totalFees", "$paidFees"] },
          },
        },
      ]);
      console.log(summary);
      res.status(200).json(summary);
    } catch (error) {
      console.error("Error fetching shift fee summary:", error);
      res
        .status(500)
        .json({ error: "Server error while fetching shift fee summary" });
    }
  },
};
