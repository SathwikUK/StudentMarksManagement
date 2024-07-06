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
router.put("/students/:rollNo", updateStudent);
router.delete("/students/:rollNo", deleteStudent);

module.exports = router;