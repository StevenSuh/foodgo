import React, {Component} from 'react';
import classes from './styles.css';

class InputPref extends Component {
	constructor(props){
		super(props);
		this.state = {doesKeyExist: false};
	}

	// checks if the group exists
	componentDidMount = () => {
		const id = this.props.idKey;
		// firebase syntax
		this.props.db.database().ref('numPeople').once("value", snapshot => {
			const key = snapshot.hasChild(id);
			if(key){
				console.log("Key exists!");
				this.setState({doesKeyExist: true});
			}
		});
	}

	render(){
		const KeyDoesntExist = () => {
			return (
				<h1>This group does not exist! Please check your link again.</h1>
			);
		};

		const KeyExists = () => {
			return (
				<div>
					<div className = {classes.inputPref_box}>
						<h4 className = {classes.input_title}>Input your preference.</h4>

						<div>
							<form className={classes.input_form}>
								<label htmlFor="genre">Preferred Genres</label><br />
								<input type="text" className={classes.text_input} id="genre" placeholder="Ex: American, Chinese, Italian ..." /><br />

								<p>Price range</p><br />
								<label htmlFor="price1">$</label>
								<input type="checkbox" id="price1" className={classes.price_input}/>

								<label htmlFor="price2">$$</label>
								<input type="checkbox" id="price2" className={classes.price_input} />

								<label htmlFor="price3">$$$</label>
								<input type="checkbox" id="price3" className={classes.price_input} /><br />

								<label htmlFor="distance" className={classes.distance}>Distance</label>
								<input type="text" id="distance" className={classes.text_input} placeholder="Ex: 50 mi"/>

								<input type="button" className={classes.submit} value = "Submit" className={classes.submit} />
							</form>
						</div>
					</div>
				</div>
			);
		};

		// conditional render
		if(this.state.doesKeyExist){
			return <KeyExists />;
		}
		else{
			return <KeyDoesntExist />;
		}
	}
}

export default InputPref;