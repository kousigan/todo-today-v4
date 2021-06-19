import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Parse from '../parse';
import { messageService } from '../actions/rxserver';

export default class Login extends React.Component {
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

  componentDidMount() {
    const str = localStorage.getItem('parseUser');
    if (str) {
      this.setState({
        message: 'User profile found, logining now.'
      });
      setTimeout(() => {
        this.setState({ redirect: '/home' });
      }, 2000);
    }
  }

  LOGINUSER = async () => {
    try {
      let user = await Parse.User.logIn(this.state.username, this.state.pass);
      this.REDIR(user);
    } catch (error) {
      this.setState({
        error: error.message
      });
    }
  };
  REDIR = user => {
    const ls = { userId: user.id, name: this.state.username };
    localStorage.setItem('parseUser', JSON.stringify(ls));
    this.setState({
      message: 'Login success. Redirecting now.'
    });
    setTimeout(() => {
      this.setState({ redirect: '/home' });
    }, 2000);
  };
  render() {
    if (!this.state.redirect) {
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
              onChange={e =>
                this.setState({ username: e.target.value, error: null })
              }
            />
            <label htmlFor="password"> Password</label>
            <input
              type="password"
              name="password"
              id="password"
              onChange={e =>
                this.setState({ pass: e.target.value, error: null })
              }
            />
            <button className="primary" onClick={this.LOGINUSER}>
              {' '}
              Submit
            </button>
          </div>
          <div className="section message success">{this.state.message}</div>
          <div className="section message error">{this.state.error}</div>
        </div>
      );
    } else {
      return <Redirect to={this.state.redirect} />;
    }
  }
}
