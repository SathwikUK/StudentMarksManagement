import React, { useState } from 'react';
import axios from 'axios';
import { Link } from 'react-router-dom';
import './EnterData.css';
import '@fortawesome/fontawesome-free/css/all.min.css';

function EnterData() {
  const [studentName, setStudentName] = useState('');
  const [rollNo, setRollNo] = useState('');
  const [branch, setBranch] = useState('');
  const [marks, setMarks] = useState({});
  const [subjects, setSubjects] = useState([]);
  const [newSubject, setNewSubject] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPopup, setShowPopup] = useState(false);
  const [popupMessage, setPopupMessage] = useState('');
  const [popupColor, setPopupColor] = useState('');
  const [errors, setErrors] = useState({});

  const branches = ["CSE", "ECE", "EEE", "ME", "CE"];

  const validateFields = () => {
    const newErrors = {};
    if (!studentName) {
      newErrors.studentName = 'This field is required.';
    }
    if (!rollNo || rollNo.length !== 10) {
      newErrors.rollNo = 'This field is required and must be exactly 10 digits.';
    }
    if (!branch) {
      newErrors.branch = 'Please select a branch.';
    }
    if (subjects.length < 6) {
      newErrors.subjects = 'At least 6 subjects are required.';
    }
    const studentMarks = subjects.map(subject => ({ subject, marks: marks[subject] || 0 }));
    if (!studentMarks.every(mark => mark.marks >= 0 && mark.marks <= 100)) {
      newErrors.marks = 'Marks must be between 0 and 100.';
    }
    setErrors(newErrors);
    return newErrors;
  };

  const checkDuplicateRollNo = async (rollNo) => {
    try {
      const response = await axios.get(`http://localhost:4000/students/checkduplicate/${rollNo}`);
      return response.data.exists;
    } catch (error) {
      console.error('Error checking duplicate roll number:', error);
      return false;
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const validationErrors = validateFields();
    if (Object.keys(validationErrors).length === 0) {
      setLoading(true);
      const isDuplicate = await checkDuplicateRollNo(rollNo);
      if (isDuplicate) {
        setLoading(false);
        setShowPopup(true);
        setPopupMessage('Error: Roll number already exists.');
        setPopupColor('error');
        setTimeout(() => {
          setShowPopup(false);
          setPopupMessage('');
          setPopupColor('');
        }, 3000);
      } else {
        axios.post('http://localhost:4000/students', {
          name: studentName,
          rollNo,
          branch,
          marks: subjects.map(subject => ({ subject, marks: marks[subject] || 0 }))
        })
        .then(() => {
          setLoading(false);
          setShowPopup(true);
          setPopupMessage('Student added successfully!');
          setPopupColor('success');
          setTimeout(() => {
            setShowPopup(false);
            setPopupMessage('');
            setPopupColor('');
            resetForm();
          }, 3000);
        })
        .catch(error => {
          setLoading(false);
          setShowPopup(true);
          setPopupMessage(`Error: ${error.message}`);
          setPopupColor('error');
          setTimeout(() => {
            setShowPopup(false);
            setPopupMessage('');
            setPopupColor('');
          }, 3000);
        });
      }
    }
  };

  const resetForm = () => {
    setStudentName('');
    setRollNo('');
    setBranch('');
    setMarks({});
    setSubjects([]);
    setNewSubject('');
    setErrors({});
  };

  const handleFieldChange = (setter, field, value) => {
    setter(value);
    const newErrors = { ...errors };
    if (value.trim()) {
      delete newErrors[field];
    } else {
      newErrors[field] = 'This field is required.';
    }
    setErrors(newErrors);
  };

  const handleAddSubject = () => {
    if (newSubject && !isNaN(newSubject)) {
      setErrors({ ...errors, newSubject: 'Subject name cannot be a number.' });
    } else if (newSubject && subjects.includes(newSubject)) {
      setErrors({ ...errors, newSubject: 'Duplicate subject name.' });
    } else if (newSubject && subjects.length < 6) {
      setSubjects([...subjects, newSubject]);
      setNewSubject('');
      setErrors({ ...errors, newSubject: '' });
    }
  };

  const handleDeleteSubject = subject => {
    setSubjects(subjects.filter(s => s !== subject));
    const newMarks = { ...marks };
    delete newMarks[subject];
    setMarks(newMarks);
  };

  const handleInputChange = (event, subject) => {
    const { value } = event.target;
    setMarks({ ...marks, [subject]: Number(value) });
    const newErrors = { ...errors };
    if (Number(value) >= 0 && Number(value) <= 100) {
      delete newErrors.marks;
    }
    setErrors(newErrors);
  };

  return (
    <div className="EnterData">
      {loading && (
        <div className="lds-roller">
          <div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div>
        </div>
      )}
      {showPopup && (
        <div className={`popup ${popupColor}`}>
          <div className="popup-content">
            <p>{popupMessage}</p>
          </div>
        </div>
      )}
      <div className="left-column">
        <h1>Enter Student Data</h1>
        <form onSubmit={handleSubmit}>
          <label>
            Student Name:<span style={{ color: 'red' }}>*</span>
            <input
              type="text"
              value={studentName}
              onChange={(event) => handleFieldChange(setStudentName, 'studentName', event.target.value)}
              required
            />
            {errors.studentName && (<p style={{ color: 'red' }}>{errors.studentName}</p>)}
          </label>
          <br />
          <label>
            Roll No:<span style={{ color: 'red' }}>*</span>
            <input
              type="text"
              value={rollNo}
              onChange={(event) => handleFieldChange(setRollNo, 'rollNo', event.target.value)}
              required
            />
            {errors.rollNo && (<p style={{ color: 'red' }}>{errors.rollNo}</p>)}
          </label>
          <br />
          <label>
            Branch:<span style={{ color: 'red' }}>*</span>
            <select
              value={branch}
              onChange={(event) => handleFieldChange(setBranch, 'branch', event.target.value)}
              required
            >
              <option value="">Select Branch</option>
              {branches.map((branch) => (
                <option key={branch} value={branch}>{branch}</option>
              ))}
            </select>
            {errors.branch && (<p style={{ color: 'red' }}>{errors.branch}</p>)}
          </label>
          <br />
          <button type="submit">Submit</button>
        </form>
      </div>
      <div className="right-column">
        <h2>Marks</h2>
        <div className="subject-marks">
          {subjects.map((subject, index) => (
            <div key={index} className="subject-container">
              <label>
                {subject}
                <input
                  type="number"
                  value={marks[subject] || ''}
                  onChange={(event) => handleInputChange(event, subject)}
                  required
                />
                {errors.marks && (<p style={{ color: 'red' }}>{errors.marks}</p>)}
              </label>
              <button type="button" className="delete-button" onClick={() => handleDeleteSubject(subject)}>
                <i className="fas fa-trash"></i>
              </button>
            </div>
          ))}
        </div>
        {subjects.length < 6 && (
          <div className="add-subject-container">
            <label>
              Add new subject:<span style={{ color: 'red' }}>*</span>
              <input
                type="text"
                value={newSubject}
                onChange={(event) => handleFieldChange(setNewSubject, 'newSubject', event.target.value)}
                required
              />
              {errors.newSubject && (<p style={{ color: 'red' }}>{errors.newSubject}</p>)}
            </label>
            <button type="button" onClick={handleAddSubject}>Add Subject</button>
          </div>
        )}
        {errors.subjects && (<p style={{ color: 'red' }}>{errors.subjects}</p>)}
      </div>
      <Link to="/">
        <button className="back-button">Back to Home</button>
      </Link>
    </div>
  );
}

export default EnterData;
