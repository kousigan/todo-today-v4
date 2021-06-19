import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Parse from '../parse';

export default class Signup extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      message: null,
      username: null,
      pass: null,
      redirect: null,
      error: null
    };
  }
  REGISTER = async () => {
    const user = new Parse.User();
    user.set('username', this.state.username);
    user.set('hint', this.state.pass);
    user.set('rememberMe', false);
    user.set('password', this.state.pass);
    console.log(user);
    try {
      let newuser = await user.signUp();
      this.REDIR();
    } catch (error) {
      this.setState({
        error: error.message
      });
    }
  };

  REDIR = () => {
    this.setState({
      message: 'User account created. You can login now.'
    });
  };
  render() {
    return (
      <div className="card form">
        <div className="section header">
          <h3>Sign up</h3>
          <Link className="link" to="/">
            Login
          </Link>
        </div>
        <div className="section">
          <label htmlFor="username"> Username</label>
          <input
            type="text"
            name="username"
            id="username"
            onChange={e =>
              this.setState({ username: e.target.value, error: null })
            }
          />
          <label htmlFor="password"> Password</label>
          <input
            type="password"
            name="password"
            id="password"
            onChange={e => this.setState({ pass: e.target.value, error: null })}
          />
          <button className="primary" onClick={this.REGISTER}>
            {' '}
            Register
          </button>
        </div>
        <div className="section message success">{this.state.message}</div>
        <div className="section message error">{this.state.error}</div>{' '}
      </div>
    );
  }
}
