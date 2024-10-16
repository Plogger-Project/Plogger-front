import React from 'react';
import './Plogger.css';
import { Route, Routes } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';

function Plogger() {
  return (
    <>
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/recruit' element={<RecruitPost />} />
      </Routes>
    </>
  );
}

export default Plogger;