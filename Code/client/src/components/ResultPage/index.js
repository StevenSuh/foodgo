import React from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../header';
import Result from './result'

const ResultPage = (props) => {
  return (
    <div>
      <Header/>
      <Result
        db={props.db}
        idKey={props.match.params.id}
      />
    </div>
  );
}

export default withRouter(ResultPage);