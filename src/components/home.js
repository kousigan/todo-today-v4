import React from 'react';
import { Link, Redirect } from 'react-router-dom';
import Parse from '../parse';
import Wrapper from './wrapper';

class Home extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: null,
      userId: null,
      redirect: null,
      logoutText: 'Logout',
      loading: true
    };
  }

  IFCURRENTUSER = () => {
    try {
      const currentUser = Parse.User.current();
      const temp = JSON.parse(localStorage.getItem('parseUser'));

      this.setState({
        userId: currentUser.id,
        loading: false,
        username: temp.name
      });
    } catch (error) {
      this.LOGOUT();
    }
  };
  componentDidMount() {
    this.IFCURRENTUSER();
  }

  LOGOUT = () => {
    this.setState({ logoutText: 'Until next time' });
    localStorage.removeItem('parseUser');
    setTimeout(() => {
      console.log(' redirect');
      this.setState({ redirect: '/' });
    }, 1000);
  };
  componentWillUnmount() {}

  render() {
    if (!this.state.redirect) {
      return (
        <div className="container">
          <header>
            <span className="title">Welcome, {this.state.username}</span>
            <button onClick={this.LOGOUT}>{this.state.logoutText}</button>
          </header>
          {this.state.loading ? '' : <Wrapper uid={this.state.userId} />}
        </div>
      );
    } else {
      return <Redirect to={this.state.redirect} />;
    }
  }
}

export default Home;
