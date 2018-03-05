import React from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../header';
import Voting from './voting';

const VotingPage = (props) => {
  return (
    <div>
      <Header/>
      <Voting
        db={props.db}
        idKey={props.match.params.id}
      />
    </div>
  );
}

export default withRouter(VotingPage);