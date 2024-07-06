const express = require("express");
const router = express.Router();
const {
  addStudent,
  getStudents,
  getStudentByRollNo,
  updateStudent,
  deleteStudent,
} = require("../controllers/studentControllers");

router.post("/students", addStudent);
router.get("/students", getStudents);
router.get("/students/:rollNo", getStudentByRollNo);
router.put("/students/:studentId", updateStudent);
router.delete("/students/:studentId", deleteStudent);

module.exports = router;
