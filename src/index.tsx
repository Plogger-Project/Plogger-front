import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Plogger from './Plogger';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigationBar from './views/NavigationBar';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';
import QnaPost from './views/QNA';
import {  RECRUIT_DETAIL_PATH, RECRUIT_PATH } from './constants';
import RecruitDetail from './views/Recruit/Detail';




const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path={RECRUIT_PATH} element={<RecruitPost />} />
        <Route path={RECRUIT_DETAIL_PATH} element={<RecruitDetail />} />
        <Route path="/active" element={<ActivePost />} />
        <Route path="/qna" element={<QnaPost />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);