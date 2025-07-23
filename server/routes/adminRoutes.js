const express = require("express");
const router = express.Router();
const { body, validationResult } = require("express-validator");
const upload = require("../middleware/upload");
const { cleanUpFilesOnError } = require("../middleware/errorMiddleware");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const {
  adminSignUp,
  adminSignIn,
  createShiftFee,
  deleteStudent,
  getDashboardStats,
} = require("../controllers/adminController");
const { loginLimiter } = require("../utils/loginLimiter");

router.post(
  "/signup",
  upload.fields([
    { name: "profileImage", maxCount: 1 },
    { name: "frontAadhaar", maxCount: 1 },
    { name: "backAadhaar", maxCount: 1 },
  ]),
  [
    body("name").trim().notEmpty().withMessage("Name is required"),
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
    body("phone")
      .matches(/^\d{10}$/)
      .withMessage("Phone must be 10 digits"),
    body("gender")
      .isIn(["Male", "Female", "Other"])
      .withMessage("Invalid gender"),
    body("aadhaar")
      .matches(/^\d{12}$/)
      .withMessage("Aadhaar must be 12 digits"),
    body("role")
      .isIn(["admin", "sub-admin", "super-admin"])
      .withMessage("Invalid admin role"),
    body("permissions").custom((value) => {
      try {
        const parsed = typeof value === "string" ? JSON.parse(value) : value;
        if (!parsed || typeof parsed !== "object") {
          throw new Error("Invalid permissions format");
        }
        return true;
      } catch (e) {
        throw new Error("Invalid permissions JSON");
      }
    }),
  ],
  cleanUpFilesOnError,
  adminSignUp
);
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
  adminSignIn
);
router.post("/shift-fees", verifyToken, createShiftFee);
router.delete("/deleteStudent", verifyToken, deleteStudent);
router.get("/dashboard/stats", verifyToken, getDashboardStats);
module.exports = router;
