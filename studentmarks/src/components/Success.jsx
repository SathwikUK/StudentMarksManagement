// Success.js

import React from 'react';
import { Link, useParams } from 'react-router-dom';
import './Success.css'; // Your custom CSS for styling

const Success = () => {
  const { id } = useParams(); // Fetch student ID from URL params

  return (
    <div className="success-container">
      <div className="success-content">
        <h1>Student added successfully!</h1>
        <p>Student ID: {id}</p>
        <Link to="/">Back to Home</Link>
      </div>
    </div>
  );
};

export default Success;
