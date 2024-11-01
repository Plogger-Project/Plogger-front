import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import Plogger from './Plogger';
import { BrowserRouter } from 'react-router-dom';
import { Provider } from './components/ui/provider';

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);
root.render(
  <React.StrictMode>
    <BrowserRouter>
      <Plogger />
    </BrowserRouter>
  </React.StrictMode>
);