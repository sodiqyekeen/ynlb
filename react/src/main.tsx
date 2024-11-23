import React from 'react';
import ReactDOM from 'react-dom/client';
import './main.css';
import App from './App';
import { UpdatePrompt } from './components/UpdatePrompt';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <App />
    <UpdatePrompt />
  </React.StrictMode>,
)
