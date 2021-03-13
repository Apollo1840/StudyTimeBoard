import { createStore, combineReducers } from 'redux';
import { authReducer } from "./redux/authReducers";

const initialState = {
    // Getting token from local storage
    auth: {
        token: localStorage.getItem('jwtToken'),
        username: localStorage.getItem('username')
    }
};
const reducer = combineReducers({
    auth: authReducer
});

// TODO: redux thunk enhancer
// ------------------------------------------------------------------------------

const store = createStore(reducer, initialState);

store.subscribe(() => {
    //subscribe to login state
    localStorage.setItem('jwtToken', store.getState().auth.token);
    //subscribe to login name
    localStorage.setItem('username', store.getState().auth.username);
});

export default store;