import React from 'react';
import Login from './components/login';
import Signup from './components/signup';
import Home from './components/home';
import { store } from './store';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect
} from 'react-router-dom';
import { messageService } from './actions/rxserver';

import './style.css';

class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loggedIn: false,
      username: null,
      userId: null,
      timer: 0
    };
  }

  componentDidMount() {
    this.timer();
    messageService.onMessage().subscribe(item => {
      this.setState(prev => (prev.timer = this.state.timer));
    });
  }
  componentDidUpdate() {}

  timer = () => {
    setInterval(() => {
      messageService.sendMessage(this.state.timer++);
    }, 1000);
  };

  componentDidCatch(error, errorInfo) {
    console.log(error, errorInfo);
  }
  render() {
    const { loggedIn, username } = this.state;
    return (
      <Router>
        <Switch>
          <Route exact path="/home/:project/:id">
            <Home />
          </Route>
          <Route exact path="/home">
            <Home />
          </Route>
          <Route exact path="/signup">
            <Signup />
          </Route>
          <Route exact path="/login">
            <Login />
          </Route>
          <Route exact path="/">
            <Login />
          </Route>
        </Switch>
      </Router>
    );
  }
}

export default App;
