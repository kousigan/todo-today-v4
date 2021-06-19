import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Parse from '../parse';
import { store } from '../store';

export default function Login() {
  const [message, setMessage] = useState(null);
  const [username, setUser] = useState(null);
  const [pass, setPass] = useState(null);

  function LOGINUSER() {
    if (username !== null || pass !== null) {
      try {
        let user = Parse.User.logIn(username, pass);
        const currentUser = Parse.User.current();
        const ls = { userId: currentUser.id, name: username };
        localStorage.setItem('parseUser', JSON.stringify(ls));
        console.log('Current logged in user', currentUser);
        store.dispatch({ type: 'setParse' });
        setMessage(() => {
          return (
            <p>
              <mark className="tertiary">Login success</mark> Redirecting in 3
              seconds.
            </p>
          );
        });
      } catch (error) {
        console.error('Error while logging in user', error);
      }
    }
  }

  return (
    <div className="card form">
      <div className="section header">
        <h3>Login</h3>
        <Link className="link" to="/signup">
          Sign up
        </Link>
      </div>
      <div className="section">
        <label htmlFor="username"> Username</label>
        <input
          type="text"
          name="username"
          id="username"
          onChange={e => setUser(e.target.value)}
        />
        <label htmlFor="password"> Password</label>
        <input
          type="password"
          name="password"
          id="password"
          onChange={e => setPass(e.target.value)}
        />
        <button className="primary" onClick={LOGINUSER}>
          {' '}
          Submit
        </button>
      </div>
      <div className="section message">{message}</div>
    </div>
  );
}
