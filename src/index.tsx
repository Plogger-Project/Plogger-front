import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './Plogger';
import Plogger from './Plogger';
import { BrowserRouter } from 'react-router-dom';
import NavigationBar from './views/NavigationBar';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Plogger />
      <NavigationBar />
    </BrowserRouter>
  </React.StrictMode>
);