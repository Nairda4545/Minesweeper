import React from "react";
import { createRoot } from 'react-dom/client';
import { Provider } from "react-redux";
import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";

import App from './components/App'
import reducers from './reducers'

const container = document.getElementById('root');
const root = createRoot(container); // createRoot(container!) if you use TypeScript
const composeEnchancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose
root.render(
    <Provider store={
        createStore(
            reducers, 
            composeEnchancers(applyMiddleware(thunk))
        )}>
        <App />
    </Provider>
);