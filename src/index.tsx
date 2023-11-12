import React from 'react';
import ReactDOM from 'react-dom/client';
import './Assets/js/sprite';
import './Assets/scss/base.scss';
import App from './Components/App/index';

const root = ReactDOM.createRoot(document.getElementById('root') as HTMLElement);

root.render(<App />);
