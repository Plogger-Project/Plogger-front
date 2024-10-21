import React from 'react';
import './Plogger.css';
import { Routes, Route, useLocation, Navigate, Router } from 'react-router-dom';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import NavigationBar from './views/NavigationBar';
import Main from './views/Main';

import QnaPost from './views/QNA';
import { RECRUIT_PATH, RECRUIT_DETAIL_PATH, RECRUIT_UPDATE_PATH, RECRUIT_WRITE_PATH } from './constants';

import RecruitView from './views/Recruit/Detail';

import Mypage from './views/MyPage';
import Mileage from './views/Mileage';
import RecruitUpdate from './views/Recruit/Update';
import RecruitWrite from './views/Recruit/Write';

// component: root path 컴포넌트 //
function Plogger() {
  
  const location = useLocation();
  
  const showNavigationBar = location.pathname !== '/sign-up';

  return (
    <>
      {showNavigationBar && <NavigationBar />}
      <Routes>
        <Route path='/main' element={<Main />} />
        <Route path='/signup' element={<SignUp />} />
        <Route path={RECRUIT_PATH} element={<RecruitPost />} />
        <Route path={RECRUIT_WRITE_PATH} element={<RecruitWrite />} />
        <Route path={RECRUIT_DETAIL_PATH} element={<RecruitView />} />
        <Route path={RECRUIT_UPDATE_PATH} element={<RecruitUpdate />} />
        <Route path='/active' element={<ActivePost />} />
        <Route path="/qna" element={<QnaPost />} />
        <Route path='/mypage' element={<Mypage />} />
        <Route path='/mileage' element={<Mileage/>} />
      </Routes>
    </>
  );
}

export default Plogger;