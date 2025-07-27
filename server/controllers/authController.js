const { User, Student } = require("../models/User");
const Payment = require("../models/Payment");
const ShiftFee = require("../models/ShiftFee");
const AuditLog = require("../models/AuditLog");
const bcrypt = require("bcryptjs");
const mongoose = require("mongoose");
const {
  calculatePaymentStatus,
  calculateTotalPaid,
} = require("../utils/helper");
module.exports = {
  getStudents: async (req, res) => {
    try {
      const students = await Student.aggregate([
        { $sort: { createdAt: -1 } },
        { $match: { role: "student" } }, // Ensure only students
        {
          $project: {
            __v: 0,
            password: 0,
            refreshToken: 0,
            loginHistory: 0,
            "aadhar._id": 0,
            "address.residential._id": 0,
            "address.permanent._id": 0,
          },
        },
        {
          $lookup: {
            from: "shiftfees",
            localField: "_id",
            foreignField: "student",
            as: "feeRecords",
            pipeline: [
              { $match: { isActive: true } }, // Only active fee records
              {
                $lookup: {
                  from: "payments",
                  localField: "payments",
                  foreignField: "_id",
                  as: "payments",
                  pipeline: [
                    { $sort: { date: -1 } }, // Sort payments by date
                    {
                      $project: {
                        _id: 1,
                        amount: 1,
                        date: 1,
                        method: 1,
                        receiptNumber: 1,
                        verified: 1,
                        academicYear: 1,
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  totalPaid: { $sum: "$payments.amount" },
                  balance: {
                    $subtract: ["$fee", { $sum: "$payments.amount" }],
                  },
                },
              },
              {
                $addFields: {
                  status: {
                    $switch: {
                      branches: [
                        { case: { $eq: ["$balance", 0] }, then: "PAID" },
                        {
                          case: { $lt: ["$balance", "$fee"] },
                          then: "PARTIAL",
                        },
                      ],
                      default: "UNPAID",
                    },
                  },
                },
              },
              {
                $project: {
                  payments: 1,
                  shift: 1,
                  fee: 1,
                  academicYear: 1,
                  totalPaid: 1,
                  balance: 1,
                  status: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            totalFees: { $sum: "$feeRecords.fee" },
            totalPaid: { $sum: "$feeRecords.totalPaid" },
            overallBalance: { $sum: "$feeRecords.balance" },
            paymentHistory: {
              $reduce: {
                input: "$feeRecords.payments",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
        { $sort: { name: 1 } }, // Sort students alphabetically
      ]);
      const finalData = students.map((student) => ({
        ...student,
        feeRecords: student.feeRecords || [],
        paymentHistory: student.paymentHistory || [],
        totalFees: student.totalFees || 0,
        totalPaid: student.totalPaid || 0,
        overallBalance: student.overallBalance || 0,
      }));
      res.status(200).json({
        success: true,
        count: finalData.length,
        data: finalData,
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
      if (!mongoose.Types.ObjectId.isValid(id)) {
        return res.status(400).json({
          status: "fail",
          message: "Invalid student ID format",
        });
      }
      console.log(req.query);
      const result = await Student.aggregate([
        {
          $match: {
            _id: new mongoose.Types.ObjectId(id),
            role: "student",
          },
        },
        {
          $project: {
            // Explicitly include only the fields you want
            name: 1,
            email: 1,
            phone: 1,
            gender: 1,
            fatherName: 1,
            school: 1,
            dob: 1,
            aadhar: 1,
            address: 1,
            isPermanentSame: 1,
            profileImage: 1,
            isActive: 1,
            createdAt: 1,
            // Omit sensitive fields by not including them
            // All other fields will be excluded automatically
          },
        },
        {
          $lookup: {
            from: "shiftfees",
            localField: "_id",
            foreignField: "student",
            as: "feeRecords",
            pipeline: [
              { $match: { isActive: true } },
              {
                $lookup: {
                  from: "payments",
                  localField: "payments",
                  foreignField: "_id",
                  as: "payments",
                  pipeline: [
                    { $sort: { date: -1 } },
                    {
                      $project: {
                        amount: 1,
                        date: 1,
                        method: 1,
                        receiptNumber: 1,
                        verified: 1,
                        academicYear: 1,
                      },
                    },
                  ],
                },
              },
              {
                $addFields: {
                  payments: { $ifNull: ["$payments", []] },
                  totalPaid: { $sum: "$payments.amount" },
                  balance: {
                    $subtract: ["$fee", { $sum: "$payments.amount" }],
                  },
                },
              },
              {
                $addFields: {
                  status: {
                    $switch: {
                      branches: [
                        { case: { $eq: ["$balance", 0] }, then: "PAID" },
                        {
                          case: { $lt: ["$balance", "$fee"] },
                          then: "PARTIAL",
                        },
                      ],
                      default: "UNPAID",
                    },
                  },
                },
              },
              {
                $project: {
                  payments: 1,
                  shift: 1,
                  fee: 1,
                  academicYear: 1,
                  totalPaid: 1,
                  balance: 1,
                  status: 1,
                  createdAt: 1,
                },
              },
            ],
          },
        },
        {
          $addFields: {
            feeRecords: { $ifNull: ["$feeRecords", []] },
            totalFees: { $sum: "$feeRecords.fee" },
            totalPaid: { $sum: "$feeRecords.totalPaid" },
            overallBalance: { $sum: "$feeRecords.balance" },
            paymentHistory: {
              $reduce: {
                input: "$feeRecords.payments",
                initialValue: [],
                in: { $concatArrays: ["$$value", "$$this"] },
              },
            },
          },
        },
      ]);

      if (result.length === 0) {
        return res.status(404).json({
          status: "fail",
          message: "Student not found",
        });
      }

      const studentData = result[0];

      // Ensure all array fields exist even if empty
      const finalData = {
        ...studentData,
        feeRecords: studentData.feeRecords || [],
        paymentHistory: studentData.paymentHistory || [],
      };
      console.log("qweq:", finalData);
      res.status(200).json({
        status: "success",
        data: finalData,
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
  // makePayment: async (req, res) => {
  //   const session = await mongoose.startSession();
  //   session.startTransaction();
  //   try {
  //     const { amount, method, transactionId, academicYear, notes } = req.body;
  //     const { studentId } = req.query;
  //     const payerRole = req.user.role;
  //     console.log(
  //       "req.body:",
  //       req.body,
  //       "req.query:",
  //       req.query,
  //       "req.user.role:",
  //       req.user.role
  //     );
  //     // 1. Validate Payment Data
  //     if (!amount || !method) {
  //       return res.status(400).json({
  //         success: false,
  //         error: "Amount and payment method are required",
  //       });
  //     }

  //     // 2. Validate Student Status
  //     const student = await User.findById(studentId).session(session);
  //     if (!student || student.role !== "student") {
  //       await session.abortTransaction();
  //       return res.status(404).json({
  //         success: false,
  //         error: "Student not found",
  //       });
  //     }

  //     // 3. Role-based permissions
  //     if (studentId && !["admin", "sub-admin"].includes(payerRole)) {
  //       await session.abortTransaction();
  //       return res.status(403).json({
  //         success: false,
  //         error: "Unauthorized to make payments for other students",
  //       });
  //     }

  //     // 4. Get/Create Shift Fee Record
  //     const year = academicYear || getCurrentAcademicYear();
  //     let shiftFee = await ShiftFee.findOne({
  //       student: studentId,
  //       academicYear: year,
  //     }).session(session);
  //     if (shiftFee && shiftFee.payments.length >= 12) {
  //       await session.abortTransaction();
  //       return res.status(400).json({
  //         success: false,
  //         error:
  //           "Maximum of 12 payments already reached for this academic year",
  //       });
  //     }
  //     // 5. Create payment record with role-specific data
  //     const paymentData = {
  //       student: studentId,
  //       shiftFee: shiftFee._id,
  //       amount,
  //       method,
  //       transactionId,
  //       academicYear: shiftFee.academicYear,
  //       notes,
  //       payerRole,
  //       status: "pending",
  //       verifiedBy: ["admin", "sub-admin"].includes(payerRole)
  //         ? req.user.id
  //         : null,
  //       paymentSource:
  //         payerRole === "student" ? "student-portal" : "admin-portal",
  //     };
  //     const payment = await Payment.create([paymentData], { session });
  //     console.log(paymentData);
  //     // 6. Update shift fee
  //     // shiftFee.payments.push(payment[0]._id);
  //     // await shiftFee.save({ session });

  //     // 7. Payment verification (simplified for example)
  //     if (["admin", "sub-admin"].includes(payerRole)) {
  //       payment[0].status = "verified";
  //       await payment[0].save({ session });
  //     }

  //     // 8. Calculate balance
  //     const balance =
  //       shiftFee.fee - (await calculateTotalPaid(shiftFee._id, session));

  //     // 9. Create audit log
  //     await createAuditLog({
  //       action: "payment",
  //       model: "Payment",
  //       documentId: payment[0]._id,
  //       changedBy: req.user.id,
  //       changes: paymentData,
  //       ipAddress: req.ip,
  //       userAgent: req.headers["user-agent"],
  //     });

  //     // 10. Commit transaction
  //     await session.commitTransaction();

  //     // 11. Send notifications
  //     // if (payerRole !== "student") {
  //     //   // await sendPaymentNotification(student.email, payment[0]._id);
  //     // }

  //     res.status(201).json({
  //       success: true,
  //       data: {
  //         paymentId: payment[0]._id,
  //         amountPaid: amount,
  //         currentBalance: balance,
  //         receiptUrl: `/receipts/${payment[0]._id}`,
  //         status: payment[0].status,
  //         payerRole,
  //       },
  //     });
  //   } catch (error) {
  //     await session.abortTransaction();
  //     console.error("Payment error:", error);

  //     const statusCode = error.name === "ValidationError" ? 400 : 500;
  //     res.status(statusCode).json({
  //       success: false,
  //       error: error.message || "Payment processing failed",
  //     });
  //   } finally {
  //     session.endSession();
  //   }
  // },
  makePayment: async (req, res) => {
    const session = await mongoose.startSession();
    let transactionCompleted = false;

    try {
      await session.withTransaction(async () => {
        // 1. Get request data
        const { amount, method, transactionId, academicYear, notes } = req.body;
        const { studentId } = req.query;
        const payerRole = req.user.role;

        // 2. Validate required fields
        if (!amount || !method) {
          throw new Error("Amount and payment method are required");
        }

        // 3. Get academic year
        const year = academicYear || getCurrentAcademicYear();

        // 4. Find shift fee record
        const shiftFee = await ShiftFee.findOne({
          student: studentId,
          academicYear: year,
        }).session(session);

        if (!shiftFee) {
          throw new Error("Shift fee record not found");
        }

        // 5. Validate payment limit
        if (shiftFee.payments && shiftFee.payments.length >= 12) {
          throw new Error("Maximum of 12 payments already reached");
        }

        // 6. Create payment record
        const payment = await Payment.create(
          [
            {
              student: studentId,
              shiftFee: shiftFee._id,
              amount: parseFloat(amount),
              method,
              transactionId,
              academicYear: year,
              notes,
              payerRole,
              status: ["admin", "sub-admin"].includes(payerRole)
                ? "verified"
                : "pending",
              verifiedBy: ["admin", "sub-admin"].includes(payerRole)
                ? req.user.id
                : null,
              paymentSource:
                payerRole === "student" ? "student-portal" : "admin-portal",
            },
          ],
          { session }
        );

        // 7. Update shift fee with atomic operation
        const updatedShiftFee = await ShiftFee.findOneAndUpdate(
          {
            _id: shiftFee._id,
            payments: {
              $size: shiftFee.payments ? shiftFee.payments.length : 0,
            },
          },
          {
            $push: { payments: payment[0]._id },
          },
          {
            new: true,
            session,
          }
        );

        if (!updatedShiftFee) {
          throw new Error("Payment conflict occurred - please try again");
        }

        // 8. Calculate balance
        const totalPaid = await calculateTotalPaid(shiftFee._id, session);
        const balance = parseFloat(shiftFee.fee) - parseFloat(totalPaid);

        // 9. Create audit log
        await AuditLog.create(
          [
            {
              action: "payment",
              model: "Payment",
              documentId: payment[0]._id,
              changedBy: req.user.id,
              changes: {
                amount: payment[0].amount,
                method: payment[0].method,
                transactionId: payment[0].transactionId,
              },
              ipAddress: req.ip,
              userAgent: req.headers["user-agent"],
            },
          ],
          { session }
        );

        transactionCompleted = true;
      });

      // Only reach here if transaction succeeded
      res.status(201).json({
        success: true,
        data: {
          paymentId: payment[0]._id,
          amountPaid: payment[0].amount,
          currentBalance: balance,
          receiptUrl: `/receipts/${payment[0]._id}`,
          status: payment[0].status,
          payerRole,
        },
      });
    } catch (error) {
      if (!transactionCompleted && session.inTransaction()) {
        await session.abortTransaction();
      }

      console.error("Payment error:", error);
      const statusCode = error.message.includes("required")
        ? 400
        : error.message.includes("not found")
        ? 404
        : error.message.includes("Maximum")
        ? 400
        : 500;

      res.status(statusCode).json({
        success: false,
        error: error.message || "Payment processing failed",
      });
    } finally {
      await session.endSession();
    }
  },
};
