import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import InputPref from './inputPref';

import classes from './styles.css';

class SurveyPage extends Component {
	render() {
		console.log(this.props);
		return(
			<div>
				<header>foodgo</header>
				<InputPref db = {this.props.db} idKey = {this.props.match.params.id}/>
			</div>
		);
	}
}

export default withRouter(SurveyPage);