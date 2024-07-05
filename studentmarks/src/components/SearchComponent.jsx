// SearchComponent.js
import React from 'react';

const SearchComponent = ({ searchValue, handleSearchChange, handleSearch }) => {
  return (
    <div className="search-container">
      <input
        type="text"
        value={searchValue}
        onChange={handleSearchChange}
        placeholder="Search by ID, Name, Branch, Roll No, Marks, or Subject"
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchComponent;

