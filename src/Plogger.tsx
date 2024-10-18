import React from 'react';
import './Plogger.css';
import { Routes, Route, useLocation, Navigate, Router } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import NavigationBar from './views/NavigationBar';
import Mypage from './views/MyPage';

// component: root path 컴포넌트 //
function Plogger() {
  
  const location = useLocation();
  
  const showNavigationBar = location.pathname !== '/sign-up';

  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <Routes>
        <Route path='/sign-up' element={<SignUp />} />
        <Route path='/recruit' element={<RecruitPost />} />
        <Route path='/active' element={<ActivePost />} />
        <Route path='/mypage' element={<Mypage />} />
      </Routes>
    </>
  );
}

export default Plogger;