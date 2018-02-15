import React, {Component} from 'react';
import classes from './styles.css';

class InputPref extends Component {
	render(){
		return(
			<div>
				<div className = {classes.inputPref_box}>
					<h4 className = {classes.input_title}>Input your preference.</h4>

					<div>
						<form className={classes.input_form}>
							<label for="genre">Preferred Genres</label><br />
							<input type="text" className={classes.genre_input} id="genre" placeholder="Ex: American, Chinese, Italian ..." /><br />
						</form>
					</div>
				</div>
			</div>	
		);
	}
}

export default InputPref;