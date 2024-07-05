import React from 'react';
import { Link } from 'react-router-dom';
import './home.css'
function Home() {
  return (
    <div className="Home">
      <h1>Welcome to Our Data Site</h1>
      <div className="buttons">
        <Link to="/enter-data">
          <button>Enter data</button>
        </Link>
        <Link to="/get-data">
        
        <button>Get data</button>
        </Link>
      </div>
    </div>
  );
}

export default Home;