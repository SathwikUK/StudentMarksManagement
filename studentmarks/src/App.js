import React from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import Home from './components/home';
import EnterData from './components/EnterData';
import StudentDataDisplay from './components/StudentDataDisplay';
import Success from './components/Success'; 
import EditStudent from './components/EditStudent';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/enter-data" element={<EnterData />} />
        <Route path="/get-data" element={<StudentDataDisplay />} />
        <Route path="/success/:id" element={<Success />} /> 
        <Route path="/edit/:id" element={<EditStudent />} />
        
      </Routes>
    </BrowserRouter>
  );
}

export default App;
