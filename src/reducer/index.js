import { store } from '../store';

function reducer(state, action) {
  switch (action.type) {
    case 'initParse':
      state = INIT_PARSE(state);
      return state;
    case 'setParse':
      state = SET_PARSE(state);
      return state;
    case 'setCredentials':
      state = SET_CRED(state, action.payload.data);
      return state;
    case 'logout':
      state = LOGOUT(state);
      return state;
    default:
      return state;
  }
}
export default reducer;

function INIT_PARSE(state) {
  const temp = localStorage.getItem('parseUser');
  if (temp !== null) {
    const userData = JSON.parse(temp);
    setTimeout(() => {
      store.dispatch({
        type: 'setCredentials',
        payload: {
          data: userData
        }
      });
    });
  }
  return state;
}
function SET_PARSE(state) {
  const temp = localStorage.getItem('parseUser');
  if (temp !== null) {
    const userData = JSON.parse(temp);
    setTimeout(() => {
      console.log('SET_PARSE', userData);
      store.dispatch({
        type: 'setCredentials',
        payload: {
          data: userData
        }
      });
    }, 3000);
  }
  return state;
}

function SET_CRED(state, payload) {
  console.log('SET_CRED', payload);
  state.userId = payload.userId;
  state.username = payload.name;
  state.loggedIn = true;
  return state;
}

function LOGOUT(state) {
  state.userId = null;
  state.username = null;
  state.loggedIn = false;
  localStorage.removeItem('parseUser');
  return state;
}
