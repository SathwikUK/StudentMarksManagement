const Student = require("../models/student");

// Add a new student
const addStudent = async (req, res) => {
  try {
    const { name, rollNo, branch, marks } = req.body;

    // Check if rollNo already exists
    const existingStudent = await Student.findOne({ rollNo });
    if (existingStudent) {
      return res.status(400).json({ message: "Student with this roll number already exists." });
    }

    // Create and save the new student
    const newStudent = new Student({
      name,
      rollNo,
      branch,
      marks
    });
    await newStudent.save();
    res.status(201).json({ message: "Student added successfully", data: newStudent });
  } catch (err) {
    console.error("Error adding student:", err);
    res.status(500).json({ message: "Error adding student", error: err.message });
  }
};

// Retrieve all students
const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ message: "Students retrieved successfully", data: students });
  } catch (err) {
    console.error("Error retrieving students:", err);
    res.status(500).json({ message: "Error retrieving students", error: err.message });
  }
};

// Retrieve a student by roll number
const getStudentByRollNo = async (req, res) => {
  try {
    const { rollNo } = req.params; // Extract rollNo from request parameters
    const student = await Student.findOne({ rollNo }).exec();
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student retrieved successfully", data: student });
  } catch (err) {
    console.error("Error retrieving student:", err);
    res.status(500).json({ message: "Error retrieving student", error: err.message });
  }
};

// Update a student by roll number
const updateStudent = async (req, res) => {
  const { rollNo } = req.params;
  const { name, branch, marks } = req.body;

  try {
    const updatedStudent = await Student.findOneAndUpdate(
      { rollNo },
      { name, branch, marks },
      { new: true }
    );

    if (!updatedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }

    res.status(200).json({ message: "Student updated successfully", data: updatedStudent });
  } catch (err) {
    console.error("Error updating student:", err);
    res.status(500).json({ message: "Error updating student", error: err.message });
  }
};

// Delete a student by roll number
const deleteStudent = async (req, res) => {
  try {
    const { rollNo } = req.params;
    const deletedStudent = await Student.findOneAndDelete({ rollNo });
    if (!deletedStudent) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Error deleting student", error: err.message });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudentByRollNo,
  updateStudent,
  deleteStudent,
};