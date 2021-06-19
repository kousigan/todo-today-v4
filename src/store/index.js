import { createStore } from 'redux';
import reducer from '../reducer';

const initState = {
  loggedIn: false,
  userId: null,
  username: null
};

export const store = createStore(reducer, initState);
