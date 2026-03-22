import React from 'react';
import ReactDOM from 'react-dom/client';
import { AppRouter } from './app/router/AppRouter';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <React.StrictMode>
    <AppRouter />
  </React.StrictMode>
);