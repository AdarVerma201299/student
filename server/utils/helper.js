const { ClientSession } = require("mongoose");
const bcrypt = require("bcryptjs");
const Student = require("../models/User");
const ShiftFee = require("../models/ShiftFee");
const Payment = require("../models/Payment");

/*
 * Calculate total verified payments for a shift fee record
 * @param {Types.ObjectId} shiftFeeId - The shift fee record ID
 * @param {ClientSession} session - MongoDB session for transaction
 * @returns {Promise<number>} Total paid amount
 */
async function calculateTotalPaid(shiftFeeId, session) {
  try {
    const result = await Payment.aggregate([
      { $match: { shiftFee: shiftFeeId, status: "verified" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]).session(session);

    return result[0]?.total || 0;
  } catch (error) {
    console.error("Error calculating total paid:", error);
    throw new Error("Failed to calculate payment total");
  }
}

/*
 * Get current academic year in format "YYYY-YYYY"
 * @returns {string} Current academic year
 */
function getCurrentAcademicYear() {
  const now = new Date();
  const year = now.getFullYear();
  return now.getMonth() >= 6 ? `${year}-${year + 1}` : `${year - 1}-${year}`;
}

/*
 * Determine payment status based on fee and payments
 * @param {number} totalFee - Total fee amount
 * @param {Array} payments - Array of payment objects
 * @returns {"PAID"|"PARTIAL"|"UNPAID"} Payment status
 */
function calculatePaymentStatus(totalFee, payments) {
  if (!Array.isArray(payments)) return "UNPAID";

  const paid = payments.reduce((sum, p) => sum + (p.amount || 0), 0);
  if (paid >= totalFee) return "PAID";
  if (paid > 0) return "PARTIAL";
  return "UNPAID";
}

/*
 * Prepare student data from request
 * @param {Request} req - Express request object
 * @returns {Object} Prepared student data
 */
function prepareStudentData(req) {
  try {
    return {
      ...req.body,
      email: req.body.email.toLowerCase().trim(),
      role: "student",
      profileImage: req.files?.profileImage?.[0]?.path,
      aadhar: {
        aadhaar: req.body.aadhaar,
        frontImage: req.files?.frontAadhaar?.[0]?.path,
        backImage: req.files?.backAadhaar?.[0]?.path,
      },
      address: {
        residential: parseAddress(req.body.residential),
        permanent:
          req.body.isPermanentSame === "true"
            ? parseAddress(req.body.residential)
            : parseAddress(req.body.permanent),
      },
    };
  } catch (error) {
    console.error("Error preparing student data:", error);
    throw new Error("Invalid address format");
  }
}

/*
 * Parse address from string or object
 * @param {string|Object} address - Address data
 * @returns {Object} Parsed address
 */
function parseAddress(address) {
  return typeof address === "string" ? JSON.parse(address) : address;
}

/*
 * Authenticate student with email and password
 * @param {string} email - Student email
 * @param {string} password - Student password
 * @returns {Promise<Student|null>} Authenticated student or null
 */
async function authenticateStudent(email, password) {
  try {
    const student = await Student.findOne({
      email: email.toLowerCase().trim(),
    }).select("+password +failedAttempts");

    if (!student || !(await bcrypt.compare(password, student.password))) {
      return null;
    }

    return student;
  } catch (error) {
    console.error("Authentication error:", error);
    throw new Error("Authentication failed");
  }
}

/*
 * Process payment transaction
 * @param {Types.ObjectId} studentId - Student ID
 * @param {number} amount - Payment amount
 * @param {string} method - Payment method
 * @param {Types.ObjectId} userId - User ID processing payment
 * @param {ClientSession} session - MongoDB session
 * @returns {Promise<Object>} Payment result
 */
async function processPayment(studentId, amount, method, userId, session) {
  try {
    const year = getCurrentAcademicYear();

    let [shiftFee] = await ShiftFee.find({
      student: studentId,
      academicYear: year,
    })
      .session(session)
      .limit(1);

    if (!shiftFee) {
      [shiftFee] = await ShiftFee.create(
        [
          {
            student: studentId,
            academicYear: year,
            lastUpdatedBy: userId,
          },
        ],
        { session }
      );
    }

    const [payment] = await Payment.create(
      [
        {
          student: studentId,
          shiftFee: shiftFee._id,
          amount,
          method,
          academicYear: year,
          verifiedBy: userId,
        },
      ],
      { session }
    );

    shiftFee.payments.push(payment._id);
    await shiftFee.save({ session });

    return {
      paymentId: payment._id,
      amountPaid: amount,
      receiptUrl: `/receipts/${payment._id}`, // Fixed typo in original
    };
  } catch (error) {
    console.error("Payment processing error:", error);
    throw new Error("Payment processing failed");
  }
}

module.exports = {
  calculateTotalPaid,
  getCurrentAcademicYear,
  processPayment,
  authenticateStudent,
  prepareStudentData,
  calculatePaymentStatus,
  parseAddress, // Exposed for testing
};
