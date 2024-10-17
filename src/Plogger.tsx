import React from 'react';
import './Plogger.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import NavigationBar from './views/NavigationBar';
import QnaPost from './views/QNA';

function Plogger() {
  return (
    <Router>
      <NavigationBar />
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path='/recruit' element={<RecruitPost />} />
        <Route path='/active' element={<ActivePost />} />
        <Route path="/qna" element={<QnaPost />} />
      </Routes>
    </Router>
  );
}

export default Plogger;