import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Header from '../header';
import InputPref from './inputPref';

class SurveyPage extends Component {
	render() {
		console.log(this.props);

		return(
			<div>
        <Header />
        <InputPref
          db={this.props.db}
          idKey={this.props.match.params.id}
        />
			</div>
		);
	}
}

export default withRouter(SurveyPage);