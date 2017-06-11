import React from 'react';
import ReactDOM from 'react-dom';
import MainPage from './main-page';
import registerServiceWorker from './registerServiceWorker';
import './index.css';

ReactDOM.render(<MainPage />, document.getElementById('root'));
registerServiceWorker();
