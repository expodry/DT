import React from 'react';
import ReactDOM from 'react-dom';
import App from './components/containers/App.js';
import { BrowserRouter } from 'react-router-dom';
import styles from './styles.css';

ReactDOM.render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
  document.getElementById('root'),
);
