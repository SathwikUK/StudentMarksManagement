import React, { useState } from "react";
import axios from "axios";

const FindStudent = () => {
  const [rollNo, setRollNo] = useState("");
  const [student, setStudent] = useState(null);
  const [error, setError] = useState("");

  const handleInputChange = (e) => {
    setRollNo(e.target.value);
  };

  const handleSearch = async () => {
    try {
      const response = await axios.get(`http://localhost:4000/api/students/rollNo/${rollNo}`);
      setStudent(response.data.data);
      setError("");
    } catch (err) {
      setError("Student not found");
      setStudent(null);
    }
  };

  return (
    <div>
      <h2>Find Student by Roll Number</h2>
      <input
        type="text"
        value={rollNo}
        onChange={handleInputChange}
        placeholder="Enter Roll Number"
      />
      <button onClick={handleSearch}>Search</button>
      {error && <p>{error}</p>}
      {student && (
        <div>
          <h3>{student.name}</h3>
          <p>Roll No: {student.rollNo}</p>
          <p>Branch: {student.branch}</p>
          <div>
            {student.marks.map((mark, index) => (
              <p key={index}>
                {mark.subject}: {mark.marks}
              </p>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default FindStudent;
