import { createStore, combineReducers, applyMiddleware, compose } from 'redux';
import thunk from 'redux-thunk';
import { authReducer } from "./redux/authReducers";

// create redux init states
const initialState = {
    // Getting token from local storage
    auth: {
        token: localStorage.getItem('jwtToken'),
        username: localStorage.getItem('username')
    }
};

// create redux reducer
const reducer = combineReducers({
    auth: authReducer
});

// ----------------- Firefox Redux Dev tools ------------------------------------
const composeEnhancers =
    typeof window === 'object' &&
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ ?
        window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__({
            // Specify extension’s options like name, actionsBlacklist, actionsCreators, serialize...
        }) : compose;

const enhancer = composeEnhancers(
    applyMiddleware(thunk),
    // other store enhancers if any
);
// ------------------------------------------------------------------------------

const store = createStore(reducer, initialState, enhancer);

// Observe and handle changes in redux store
store.subscribe(() => {
    //subscribe to login state
    localStorage.setItem('jwtToken', store.getState().auth.token);
    //subscribe to login name
    localStorage.setItem('username', store.getState().auth.username);
});

export default store;