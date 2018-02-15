import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import CreateRoom from './createRoom';

import classes from './styles.css';

class LandingPage extends Component {
  render() {
    return (
      <div className={classes.landingPage}>
        <h2 className={classes.landingPage_title}>
          foodgo
        </h2>

        <CreateRoom db = {this.props.db}/>

        <footer className={classes.landingPage_footer}>
          <p className={classes.landingPage_footer_text}>
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