import React from 'react';
import './Plogger.css';
import { Route, Routes } from 'react-router-dom';
import SignUp from './views/Auth';

function Plogger() {
  return (
    <Route path='/signup' element={<SignUp />} />
  );
}

export default Plogger;