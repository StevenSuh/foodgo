import React, { Component } from 'react';
import './App.css';

import { Route, Switch } from 'react-router-dom';

import LandingPage from './components/LandingPage';

class App extends Component {
  render() {
    return (
      <Switch>
        <Route path='/' exact component={LandingPage} />
      </Switch>
    );
  }
}

export default App;
