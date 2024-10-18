import React from 'react';
import './Plogger.css';
import { Routes, Route, useLocation, Navigate, Router } from 'react-router-dom';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';


import QnaPost from './views/QNA';


import Mypage from './views/MyPage';
import Mileage from './views/Mileage';


// component: root path 컴포넌트 //
function Plogger() {
  
  const location = useLocation();
  
  const showNavigationBar = location.pathname !== '/sign-up';

  return (
    <>
      <Routes>
        <Route path='/mileage' element={<Mileage/>} />
      </Routes>
    </>
  );
}

export default Plogger;