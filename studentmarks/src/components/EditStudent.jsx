import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const EditStudent = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [student, setStudent] = useState({
    name: '',
    rollNo: '',
    branch: '',
    marks: [],
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchStudent = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/students/${id}`);
        setStudent(response.data.data);
        setLoading(false);
      } catch (error) {
        console.error('Error fetching student:', error);
        setError('Student not found');
        setLoading(false);
      }
    };

    fetchStudent();

  }, [id]);

  const handleSubmit = async (event) => {
    event.preventDefault();
    
    try {
      // Validate form data
      if (!student.name || !student.rollNo || !student.branch) {
        setError('All fields are required');
        return;
      }

      // Update student data
      await axios.put(`http://localhost:4000/students/${id}`, student);
      navigate('/get-data');
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Error updating student');
    }
  };

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudent(prevStudent => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  if (loading) {
    return <p>Loading...</p>;
  }

  if (error) {
    return <p>{error}</p>;
  }

  return (
    <div>
      <h1>Edit Student</h1>
      <form onSubmit={handleSubmit}>
        <label>
          Student Name:
          <input type="text" name="name" value={student.name} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Roll No:
          <input type="text" name="rollNo" value={student.rollNo} onChange={handleInputChange} />
        </label>
        <br />
        <label>
          Branch:
          <input type="text" name="branch" value={student.branch} onChange={handleInputChange} />
        </label>
        <br />
        <button type="submit">Update</button>
      </form>
    </div>
  );
};

export default EditStudent;
