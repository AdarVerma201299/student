const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const { body, validationResult } = require("express-validator");
const router = express.Router();
const {
  getStudentData,
  getStudents,
  getStudentShiftFees,
  makePayment,
} = require("../controllers/authController");

router.get("/student", verifyToken, getStudentData);
router.get(
  "/students",
  verifyToken,
  authorizeRole(["admin", "supervisor"]),
  getStudents
);

router.get(
  "/shift-fees/summary",
  authorizeRole(["admin", "sub-admin"]),
  getStudentShiftFees
);
router.post(
  "/makepayment",
  verifyToken,
  authorizeRole(["student", "admin", "sub-admin"]),
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("paymentMethod")
      .isIn(["cash", "card", "upi", "netbanking"])
      .withMessage("Invalid payment method"),
    body("transactionId").optional().isString(),
  ],
  makePayment
);
module.exports = router;
