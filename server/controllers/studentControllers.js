const Student = require("../models/student");

const addStudent = async (req, res) => {
  try {
    const { name, rollNo, branch, marks } = req.body;
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

const getStudents = async (req, res) => {
  try {
    const students = await Student.find();
    res.status(200).json({ message: "Students retrieved successfully", data: students });
  } catch (err) {
    console.error("Error retrieving students:", err);
    res.status(500).json({ message: "Error retrieving students", error: err.message });
  }
};

const getStudentById = async (req, res) => {
  try {
    const student = await Student.findById(req.params.id);
    if (!student) {
      return res.status(404).json({ message: "Student not found" });
    }
    res.status(200).json({ message: "Student retrieved successfully", data: student });
  } catch (err) {
    console.error("Error retrieving student:", err);
    res.status(500).json({ message: "Error retrieving student", error: err.message });
  }
};

const updateStudent = async (req, res) => {
  const { id } = req.params;
  const { name, rollNo, branch, marks } = req.body;

  try {
    const updatedStudent = await Student.findByIdAndUpdate(
      id,
      { name, rollNo, branch, marks },
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

const deleteStudent = async (req, res) => {
  try {
    const { id } = req.params;
    await Student.findByIdAndDelete(id);
    res.status(200).json({ message: "Student deleted successfully" });
  } catch (err) {
    console.error("Error deleting student:", err);
    res.status(500).json({ message: "Error deleting student", error: err.message });
  }
};

module.exports = {
  addStudent,
  getStudents,
  getStudentById,
  updateStudent,
  deleteStudent,
};