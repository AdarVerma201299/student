const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getStudentData,
  getStudents,
  getStudentShiftFees,
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
module.exports = router;
