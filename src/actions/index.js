import { createStore, applyMiddleware } from 'redux';
import { thunkMiddleware, thunk } from 'redux-thunk';
import Parse from '../parse';

const userState = {
  loading: false,
  user: [],
  error: ''
};

const FETCH_USER_REQUEST = 'FETCH_USER_REQUEST';
const FETCH_USER_SUCCESS = 'FETCH_USER_SUCCESS';
const FETCH_USER_ERROR = 'FETCH_USER_ERROR';

const fetchUserRequest = () => {
  return {
    type: FETCH_USER_REQUEST
  };
};

const fetchUserSuccess = user => {
  return {
    type: FETCH_USER_SUCCESS,
    payload: user
  };
};

const fetchUserError = error => {
  return {
    type: FETCH_USER_ERROR,
    payload: error
  };
};

const reducer = (state = userState, action) => {
  switch (action.type) {
    case FETCH_USER_REQUEST:
      return { ...state, loading: true };
    case FETCH_USER_SUCCESS:
      return { loading: false, users: actions.payload, error: '' };
    case FETCH_USER_ERROR:
      return { loading: false, users: [], error: action.payload };
  }
};

const fetchUser = () => {
  return function(dispatch) {
    dispatch(fetchUserRequest());
    try {
      let user = Parse.User.logIn('kousi', 'kousi');
      const currentUser = Parse.User.current();
      const asyncResult = { id: currentUser.id };
      dispatch(fetchUserSuccess(asyncResult));
    } catch (error) {
      dispatch(fetchUserError(error));
    }
  };
};
const store = createStore(reducer, applyMiddleware(thunkMiddleware));
store.subscribe(() => console.log(store.getState()));

export const runFunc = () => {
  store.dispatch(fetchUser());
};
