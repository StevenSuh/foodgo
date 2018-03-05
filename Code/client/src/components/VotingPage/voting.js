import React, { Component } from 'react';
import axios from 'axios';

import url from '../../url';

class Voting extends Component {
  componentDidMount() {
    console.log(this.props);
  }

  render() {
    console.log(this.props);
    return (
      <div>
        <h1 style={{ textAlign: 'center' }}>Voting Page</h1>
      </div>
    );
  }
}

export default Voting;