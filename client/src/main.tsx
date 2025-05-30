import {createRoot} from 'react-dom/client'
import './main.scss'
import {Provider} from "react-redux";
import React from 'react';
import {store} from './app/store';
import App from './App';
import 'bootstrap/dist/css/bootstrap.min.css';
import {ToastProvider} from './components/ToastProvider';


createRoot(document.getElementById('root')!).render(
    <React.StrictMode>
        <Provider store={store}>
            <ToastProvider>
                <App/>
            </ToastProvider>
        </Provider>
    </React.StrictMode>
)
