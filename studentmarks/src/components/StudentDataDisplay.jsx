import React, { useState,useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import './StudentDataDisplay.css';

const StudentDataDisplay = () => {
  const [studentData, setStudentData] = useState([]);
  const [searchValue, setSearchValue] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [popupVisible, setPopupVisible] = useState(false);
  const [deleteConfirmVisible, setDeleteConfirmVisible] = useState(false);
  const [studentToDelete, setStudentToDelete] = useState(null);
  const [deleteMessage, setDeleteMessage] = useState('');
  const [editPopupVisible, setEditPopupVisible] = useState(false);
  const [studentToEdit, setStudentToEdit] = useState(null);
  const [updateMessage, setUpdateMessage] = useState('');

  // Encryption function
  const encryptSecret = (secret) => {
    const encrypted = secret.split('').map(char => String.fromCharCode(char.charCodeAt(0) + 1)).join('');
    return encrypted;
  };

  // Decryption function
  const decryptSecret = (encryptedSecret) => {
    const decrypted = encryptedSecret.split('').map(char => String.fromCharCode(char.charCodeAt(0) - 1)).join('');
    return decrypted;
  };

  useEffect(() => {
    fetchStudentData();
  }, []);

  const fetchStudentData = () => {
    axios.get('https://student-marks-management-three.vercel.app/students')
      .then(response => {
        const students = response.data.data;
        setStudentData(students);
        setFilteredData([]); // Initialize filteredData as empty
      })
      .catch(error => {
        console.error(error);
      });
  };

  const filterData = () => {
    if (!searchValue) {
      setFilteredData([]);
      return;
    }

    const encryptedSearchValue = encryptSecret(searchValue.toLowerCase());

    if (encryptedSearchValue === encryptSecret("sukrscollab")) {
      setFilteredData(studentData); // Display all student data
      return;
    }

    const filtered = studentData.filter(student => {
      return (
        student.rollNo.toLowerCase() === decryptSecret(encryptedSearchValue)
      );
    });

    setFilteredData(filtered);

    if (filtered.length === 0) {
      setPopupVisible(true);
    }
  };

  const handleDeleteStudent = () => {
    if (!studentToDelete) return;

    axios.delete(`https://student-marks-management-three.vercel.app/students/${studentToDelete}`)
      .then(response => {
        console.log('Student deleted successfully:', response.data.message);
        fetchStudentData(); // Refresh the student data after deletion
        setDeleteConfirmVisible(false);
        setDeleteMessage('Student entry deleted successfully!');
        setTimeout(() => {
          setDeleteMessage('');
          setStudentToDelete(null); // Reset studentToDelete state
        }, 3000);
      })
      .catch(error => {
        console.error('Error deleting student:', error);
      });
  };

  const handleSearchChange = (e) => {
    setSearchValue(e.target.value);
  };

  const handleSearch = () => {
    filterData();
  };

  const confirmDelete = (studentId) => {
    setStudentToDelete(studentId);
    setDeleteConfirmVisible(true);
  };

  const closeDeleteConfirm = () => {
    setDeleteConfirmVisible(false);
    setStudentToDelete(null);
  };

  const openEditPopup = (student) => {
    setStudentToEdit(student);
    setEditPopupVisible(true);
  };

  const closeEditPopup = () => {
    setEditPopupVisible(false);
    setStudentToEdit(null);
  };

  return (
    <div className="StudentDataDisplay">
      <h1 align="center">Student Data Display</h1>

      <div className="search-container">
        <input 
          type="text" 
          className="search-bar" 
          placeholder="Search by Roll No..." 
          value={searchValue} 
          onChange={handleSearchChange} 
        />
        <button className="search-button" onClick={handleSearch}>Search</button>
      </div>

      {deleteMessage && (
        <div className="delete-message">
          <span>&#10004;</span> {deleteMessage}
        </div>
      )}

      {updateMessage && (
        <div className="update-message">
          <span>&#10004;</span> {updateMessage}
        </div>
      )}

      <div className="card-container">
        {filteredData.map((student, index) => (
          <div key={index} className="card">
            <div className="left-side">
              <h2>{student.name}</h2>
              <p>Roll No: {student.rollNo}</p>
              <p>Branch: {student.branch}</p>
              <div className="marks-table">
                <table>
                  <thead>
                    <tr>
                      <th>Subject</th>
                      <th>Marks</th>
                    </tr>
                  </thead>
                  <tbody>
                    {student.marks.map((mark, index) => (
                      <tr key={index}>
                        <td>{mark.subject}</td>
                        <td>{mark.marks}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              <div className="action-buttons">
                <button className="edit-button" onClick={() => openEditPopup(student)}>Edit</button>
                <button className="delete-button" onClick={() => confirmDelete(student._id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <Link to="/">
        <button className='back-home-button'>Back to Home</button>
      </Link>

      {popupVisible && (
        <div className="popup-container show-popup">
          <div className="popup">
            <h2>Student Not Found</h2>
            <button className="cancel-button" onClick={() => setPopupVisible(false)}>Close</button>
          </div>
        </div>
      )}

      {deleteConfirmVisible && (
        <div className="popup-container show-popup">
          <div className="popup">
            <h2>Are you sure you want to delete this student?</h2>
            <button className="delete-button" onClick={handleDeleteStudent}>Delete</button>
            <button className="cancel-button" onClick={closeDeleteConfirm}>Cancel</button>
          </div>
        </div>
      )}

      {editPopupVisible && studentToEdit && (
        <EditStudentPopup 
          student={studentToEdit} 
          onClose={closeEditPopup} 
          fetchStudentData={fetchStudentData} 
          setUpdateMessage={setUpdateMessage}
        />
      )}
    </div>
  );
};

const EditStudentPopup = ({ student, onClose, fetchStudentData, setUpdateMessage }) => {
  const [studentData, setStudentData] = useState({ ...student });
  const [error, setError] = useState('');

  const handleInputChange = (event) => {
    const { name, value } = event.target;
    setStudentData(prevStudent => ({
      ...prevStudent,
      [name]: value,
    }));
  };

  const handleMarksChange = (index, field, value) => {
    const updatedMarks = studentData.marks.map((mark, i) => (
      i === index ? { ...mark, [field]: value } : mark
    ));
    setStudentData(prevStudent => ({
      ...prevStudent,
      marks: updatedMarks,
    }));
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    try {
      // Validate form data
      if (!studentData.name || !studentData.rollNo || !studentData.branch) {
        setError('All fields are required');
        return;
      }
      // Update student data
      await axios.put(`https://student-marks-management-three.vercel.app/students/${student._id}`, studentData);
      fetchStudentData(); // Refresh the student data after updating
      setUpdateMessage('Student entry updated successfully!');
      setTimeout(() => setUpdateMessage(''), 3000);
      onClose(); // Close the edit popup
    } catch (error) {
      console.error('Error updating student:', error);
      setError('Error updating student');
    }
  };

  return (
    <div className="popup-container show-popup">
      <div className="popup">
        <h2>Edit Student</h2>
        {error && <p className="error">{error}</p>}
        <form onSubmit={handleSubmit}>
          <label>
            Student Name:
            <input type="text" name="name" value={studentData.name} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Roll No:
            <input type="text" name="rollNo" value={studentData.rollNo} onChange={handleInputChange} />
          </label>
          <br />
          <label>
            Branch:
            <input type="text" name="branch" value={studentData.branch} onChange={handleInputChange} />
          </label>
          <br />
          {studentData.marks.map((mark, index) => (
            <div key={index} className="marks-input">
              <label>
                Subject:
                <input
                  type="text"
                  value={mark.subject}
                  onChange={(e) => handleMarksChange(index, 'subject', e.target.value)}
                />
              </label>
              <label>
                Marks:
                <input
                  type="text"
                  value={mark.marks}
                  onChange={(e) => handleMarksChange(index, 'marks', e.target.value)}
                />
              </label>
            </div>
          ))}
          <br />
          <button type="submit">Update</button>
          <button type="button" className="cancel-button" onClick={onClose}>Cancel</button>
        </form>
      </div>
    </div>
  );
};

export default StudentDataDisplay;