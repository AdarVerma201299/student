const express = require("express");
const { verifyToken, authorizeRole } = require("../middleware/authMiddleware");
const router = express.Router();
const {
  getStudentData,
  getStudents,
} = require("../controllers/authController");

router.get("/student/:id", verifyToken, getStudentData);
router.get(
  "/students",
  verifyToken,
  authorizeRole(["admin", "supervisor"]),
  getStudents
);

module.exports = router;
