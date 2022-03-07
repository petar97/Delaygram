import React from 'react';
import ReactDOM from 'react-dom';
import App from './App';
import FirebaseContext from './context/firebase';
import { firebase, db, FieldValue, storage } from './lib/firebase';
import './styles/globals.css';

ReactDOM.render(
    <FirebaseContext.Provider value={{ firebase, db, FieldValue, storage }}>
        <App />
    </FirebaseContext.Provider>,
    document.getElementById('root')
);
