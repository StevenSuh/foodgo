import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import CreateRoom from './createRoom';

import './styles.css';

class LandingPage extends Component {
  render() {
    return (
      <div className="landingPage">
        <h2 className="landingPage_title">
          foodgo
        </h2>

        <CreateRoom db = {this.props.db}/>

        <footer className="landingPage_footer">
          <p className="landingPage_footer_text">
            Email at <a href="mailto:foodgo183@gmail.com" target="_top">foodgo183@gmail.com</a>
            <br/>
            Copyright 2018
          </p>
        </footer>
      </div>
    );
  }
}

export default withRouter(LandingPage);