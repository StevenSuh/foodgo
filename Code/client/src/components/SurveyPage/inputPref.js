import React, {Component} from 'react';
import ReactDOM from 'react-dom';

import OutputList from './outputList';

import classes from './styles.css';

class InputPref extends Component {
	constructor(props){
		super(props);

		this.state = { 
			doesKeyExist: false,
			categories: '',
			price: '',
			radius: '',
			location: '',
			showOutput: false
		};

		this.onSubmitClick = this.onSubmitClick.bind(this);
		this.onOutputClose = this.onOutputClose.bind(this);
		this.onInputChange = this.onInputChange.bind(this);

		this.renderOutput = this.renderOutput.bind(this);
	}

	// checks if the group exists
	componentDidMount() {
		console.log(navigator.geolocation.getCurrentPosition(position => {
			console.log(position);
			this.setState({ ...this.state, location: { lat: position.coords.latitude, lng: position.coords.longitude } });
		}, err => {
			console.log(err);
		}));
		const id = this.props.idKey;
		// firebase syntax
		this.props.db.database().ref('numPeople').once("value", snapshot => {
			const key = snapshot.hasChild(id);
			if(key){
				console.log("Key exists!");
				this.setState({ ...this.state, doesKeyExist: true });
			}
		});
	}

	onSubmitClick(event) {
		event.preventDefault();
		this.setState({ ...this.state, showOutput: true });
	}

	onOutputClose() {
		this.setState({ ...this.state, showOutput: false });
	}

	onInputChange(event) {
		this.setState({ ...this.state, [event.target.name]: event.target.value });
	}

	renderOutput() {
		if (this.state.showOutput) {
			const data = { ...this.state };
			delete data.doesKeyExist;
			delete data.showOutput;
			delete data.location;

      ReactDOM.render(
        <OutputList 
        	compData={data}
        	compLocation={this.state.location}
        	compClose={this.onOutputClose}
        />, 
        document.getElementById('modal')
      );
    } else {
      ReactDOM.render(null, document.getElementById('modal'));
		}
	}

	render(){
		console.log(this.state);

		const KeyDoesntExist = (
			<h1 style={{ textAlign: 'center' }}>
				This group does not exist!
				<br/>
				Please check your link again.
			</h1>
		);

		const KeyExists = (
			<div>
				<div className = {classes.inputPref_box}>
					<h4 className = {classes.input_title}>Input your preference.</h4>

					<div>
						<form className={classes.input_form}>
							<label className={classes.label} htmlFor="genre">Preferred Genres</label><br />
							<div className={classes.text_input_wrapper}>
								<input type="text" name="categories" className={classes.text_input} id="genre" placeholder="Ex: American, Chinese, Italian ..." 
									value={this.state.categories}
									onChange={this.onInputChange}
								/>
							</div>
							<br />
							
							<p className={classes.label}>Price range</p><br />
							<label htmlFor="price1">$</label>
							<input type="radio" name="price" id="price1" value="1" className={classes.price_input} 
								onChange={this.onInputChange}
								checked={this.state.price === '1'}
							/>

							<label htmlFor="price2">$$</label>
							<input type="radio" name="price" id="price2" value="1, 2" className={classes.price_input} 
								onChange={this.onInputChange}
								checked={this.state.price === '1, 2'}
							/>

							<label htmlFor="price3">$$$</label>
							<input type="radio" name="price" id="price3" value="1, 2, 3" className={classes.price_input} 
								onChange={this.onInputChange}
								checked={this.state.price === '1, 2, 3'}
							/>
							<br />
							<br />

							<label htmlFor="distance" className={`${classes.distance} ${classes.label}`}>Distance</label>
							<div className={classes.text_input_wrapper}>
								<input type="number" name="radius" id="distance" className={classes.text_input} placeholder="Ex: 50 mi"
									value={this.state.radius}
									onChange={this.onInputChange}
								/>
							</div>

							<button 
								className={classes.submit} 
								onClick={this.onSubmitClick}
							>
								Submit
							</button>
						</form>
					</div>
				</div>
			</div>
		);

		this.renderOutput();
		// conditional render
		if(this.state.doesKeyExist){
			return KeyExists;
		}
		else{
			return KeyDoesntExist;
		}
	}
}

export default InputPref;
