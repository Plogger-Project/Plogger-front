import React from 'react';
import './Plogger.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import Main from './views/Main';

function Plogger() {
  return (
      <Routes>
        <Route path='/main' element={<Main />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path='/recruit' element={<RecruitPost />} />
        <Route path='/active' element={<ActivePost />} />
      </Routes>
  );
}

export default Plogger;