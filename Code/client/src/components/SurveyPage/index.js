import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import InputPref from './inputPref';

import classes from './styles.css';

class SurveyPage extends Component {
	render() {
		return(
			<div>
				<header>foodgo</header>
				<InputPref/>
			</div>
		);
	}
}

export default withRouter(SurveyPage);