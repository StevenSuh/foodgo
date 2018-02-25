import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';

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
			showOutput: false,
			finishedInput: false,
			initialized: false
		};

		this.onSubmitClick = this.onSubmitClick.bind(this);
		this.onOutputClose = this.onOutputClose.bind(this);
		this.onInputChange = this.onInputChange.bind(this);

		this.renderOutput = this.renderOutput.bind(this);
		this.onSubmitData = this.onSubmitData.bind(this);
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
			const key = snapshot.child(id);

			if (key && localStorage.getItem(`foodgo_${id}`)) {
				const value = key.val();
				
				if (value.currPeople === value.numPeople) {
					return this.props.history.push(`/${id}/vote`);
				}

				return this.setState({ ...this.state, initialized: true, doesKeyExist: true, finishedInput: true });
			}
			this.setState({ ...this.state, initialized: true, doesKeyExist: true });
		});
		// this.setState({ ...this.state, initialized: true });
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

	onSubmitData(data) {
		const id = this.props.idKey;
		const db = this.props.db.database().ref(`numPeople/${id}`);

		db.once('value', snapshot => {
			const value = snapshot.val();

			if (value.currPeople < value.numPeople) {
				const newData = { ...value };
				newData.currPeople += 1;

				if (!newData.restaurants) {
					newData.restaurants = [];
				}
				newData.restaurants.push(data[0].props.compData);
				newData.restaurants.push(data[1].props.compData);

				db.update(newData, error => {
					// set this browser to valid browser
					localStorage.setItem(`foodgo_${id}`, 1);
					
					// on value change
					db.on('value', dataSnapshot => {
						const updatedData = dataSnapshot.val();
						console.log('updated:', updatedData);
						if (updatedData.currPeople === updatedData.numPeople) {
							this.props.history.push(`/${id}/vote`);
							db.off('value');
						}
					});
					
					this.setState({ ...this.state, showOutput: false, finishedInput: true });
				});
			}
		});
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
        	compSubmit={this.onSubmitData}
        />, 
        document.getElementById('modal')
      );
    } else {
      ReactDOM.render(null, document.getElementById('modal'));
		}
	}

	KeyDoesntExist = (
		<h1 style={{ textAlign: 'center' }}>
			This group does not exist!
			<br/>
			Please check your link again.
		</h1>
	);

	waitingOnOthers = (
		<div>
			<h1 style={{ textAlign: 'center', margin: '1em' }}>
				Thanks for your input.
			</h1>
			<h3 style={{ textAlign: 'center' }}>
				Waiting on others				
			</h3>
			<br/>
	    <div className={classes.loading}>
	      <svg className={classes.circular} viewBox="25 25 50 50">
	        <circle className={classes.path} cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10"/>
	      </svg>
	    </div>
		</div>
	)

	render(){
		if (!this.state.initialized) {
			return '';
		}
		console.log(this.state);

		const KeyExists = (
			<div>
				<div className = {classes.inputPref_box}>
					<h4 className = {classes.input_title}>Input your preference.</h4>

					<div>
						<form className={classes.input_form}>
							<label className={classes.label} htmlFor="genre">Search Term</label><br />
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
			if (this.state.finishedInput) {
				return this.waitingOnOthers;
			}
			return KeyExists;
		}
		return this.KeyDoesntExist;
	}
}

export default withRouter(InputPref);
