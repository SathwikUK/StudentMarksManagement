
const mongoose = require("mongoose");

const studentSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  rollNo: {
    type: String,
    required: true,
    unique:true
  },
  branch: {
    type: String,
    required: true,
  },
  marks: [
    {
      subject: {
        type: String,
        required: true,
      },
      marks: {
        type: Number,
        required: true,
      },
    },
  ],
});

const Student = mongoose.model("Student", studentSchema);

module.exports = Student;
