import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Plogger from './Plogger';
import { BrowserRouter, Route, Routes } from 'react-router-dom';
import NavigationBar from './views/NavigationBar';
import SignUp from './views/Auth';
import RecruitPost from './views/Recruit';
import ActivePost from './views/Active';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <NavigationBar />
      <Routes>
        <Route path="/signup" element={<SignUp />} />
        <Route path="/recruit" element={<RecruitPost />} />
        <Route path="/active" element={<ActivePost />} />
      </Routes>
    </BrowserRouter>
  </React.StrictMode>
);