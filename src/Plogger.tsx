import React from 'react';
import './Plogger.css';
import { Routes, Route, useLocation, Navigate, Router } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import NavigationBar from './views/NavigationBar';

import QnaPost from './views/QNA';
import { RECRUIT_PATH, RECRUIT_DETAIL_PATH } from './constants';

import RecruitView from './views/Recruit/Detail';

import Mypage from './views/MyPage';
import Mileage from './views/Mileage';

// component: root path 컴포넌트 //
function Plogger() {
  
  const location = useLocation();
  
  const showNavigationBar = location.pathname !== '/sign-up';

  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <Routes>
        <Route path='/signup' element={<SignUp />} />
        <Route path={RECRUIT_PATH} element={<RecruitPost />} />
        <Route path={RECRUIT_DETAIL_PATH} element={<RecruitView />} />
        <Route path='/active' element={<ActivePost />} />
        <Route path="/qna" element={<QnaPost />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/mileage' element={<Mileage/>} />
      </Routes>
    </>
  );
}

export default Plogger;