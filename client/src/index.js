import React, { StrictMode } from 'react';
import ReactDOM from 'react-dom/client';

import App from './App';
import { ContextProvider } from './Context';

import './styles.css';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <StrictMode>
  <ContextProvider>
    <App />
  </ContextProvider>
  </StrictMode>
);