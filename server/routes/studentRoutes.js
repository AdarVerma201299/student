const express = require("express");
const router = express.Router();
const upload = require("../middleware/upload");
const { authorizeRole } = require("../middleware/authMiddleware");
const { verifyToken } = require("../utils/jwtUtils");
const { cleanUpFilesOnError } = require("../middleware/errorMiddleware");
const { body, validationResult } = require("express-validator");
const fs = require("fs");
const {
  signIn,
  signUp,
  makePayment,
  getChatMessages,
  sendMessage,
} = require("../controllers/studentController");
const { loginLimiter } = require("../utils/loginLimiter");

// Helper middleware for cleaning up files on validation errors

// Student SignUp
router.post(
  "/SignUp",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "frontAadhaar", maxCount: 1 },
    { name: "backAadhaar", maxCount: 1 },
  ]),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
    body("fatherName")
      .trim()
      .notEmpty()
      .withMessage("Father's name is required"),
    body("dob").isDate().withMessage("Valid date of birth required"),
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password")
      .isLength({ min: 8 })
      .withMessage("Password must be at least 8 characters")
      .matches(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/
      )
      .withMessage(
        "Password must contain uppercase, lowercase, number and special character"
      ),
    body("aadhaar")
      .matches(/^\d{12}$/)
      .withMessage("Aadhaar must be 12 digits"),
    body("phone")
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("school").notEmpty().withMessage("School/College name is required"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender"),
    body("residential").custom((value) => {
      try {
        const addr = JSON.parse(value);
        return !!addr;
      } catch {
        throw new Error("Invalid residential address format");
      }
    }),
    body("permanent").custom((value) => {
      try {
        const addr = JSON.parse(value);
        return !!addr;
      } catch {
        throw new Error("Invalid permanent address format");
      }
    }),
    body("isPermanentSame").isBoolean().withMessage("Must be true or false"),
  ],
  cleanUpFilesOnError,
  signUp
);

// Student SignIn
router.post(
  "/signin",
  loginLimiter,
  [
    body("email")
      .isEmail()
      .normalizeEmail()
      .withMessage("Valid email required"),
    body("password").notEmpty().withMessage("Password is required"),
  ],
  signIn
);

// Student MakePayment
router.post(
  "/MakePayment",
  verifyToken,
  authorizeRole(["student"]),
  [
    body("amount").isNumeric().withMessage("Amount must be a number"),
    body("paymentMethod")
      .isIn(["cash", "card", "upi", "netbanking"])
      .withMessage("Invalid payment method"),
    body("transactionId").optional().isString(),
  ],
  makePayment
);

// Student ChatWithAdmin
// router.post(
//   "/ChatWithAdmin",
//   verifyToken,
//   authorizeRole(["student"]),
//   [
//     body("message").notEmpty().withMessage("Message cannot be empty"),
//     body("adminId").isMongoId().withMessage("Invalid admin ID"),
//   ],
//   sendMessage
// );

// Get Chat History
// router.get(
//   "/ChatHistory",
//   verifyToken,
//   authorizeRole(["student"]),
//   getChatMessages
// );

// Student Profile
// router.get(
//   "/Profile",
//   verifyToken,
//   authorizeRole(["student"]),
//   StudentController.GetProfile
// );

// Token Verification

module.exports = router;
