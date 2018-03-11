/* eslint react/no-multi-comp: 0, max-len: 0 */
/* eslint import/no-webpack-loader-syntax: off */
import '!style-loader!css-loader!rc-slider/assets/index.css';

import React, {Component} from 'react';
import ReactDOM from 'react-dom';
import { withRouter } from 'react-router-dom';

import axios from 'axios';

import Slider from 'rc-slider';

import OutputList from './outputList';

import classes from './styles.css';

import url from '../../url';

class InputPref extends Component {
	constructor(props){
		super(props);

		this.state = { 
			doesKeyExist: false,
			categories: '',
			price: '',
			radius: 1,
			location: '',
			showOutput: false,
			finishedInput: false,
			initialized: false,
			fullRoom: false
		};

		this.onSubmitClick = this.onSubmitClick.bind(this);
		this.onOutputClose = this.onOutputClose.bind(this);
		this.onInputChange = this.onInputChange.bind(this);

		this.renderOutput = this.renderOutput.bind(this);
		this.onSubmitData = this.onSubmitData.bind(this);
	}

	// checks if the group exists
	componentDidMount() {
		// navigator.geolocation.getCurrentPosition(position => {
			// const newLocation = { lat: position.coords.latitude, lng: position.coords.longitude };
			const newLocation = { lat: 37, lng: -122 };

			const id = this.props.idKey;
			// firebase syntax
			this.props.db.database().ref('numPeople').once("value", snapshot => {
				const key = snapshot.hasChild(id);

				if (key) {
					const value = snapshot.child(id).val();
					
					if (value.inputs === value.numPeople) {
						if (localStorage.getItem(`foodgo_input_${id}`)) {
							return this.props.history.push(`/${id}/vote`);
						} else {
							return this.setState({ ...this.state, location: newLocation, fullRoom: true, initialized: true, doesKeyExist: key, finishedInput: false });
						}
					}

					return this.setState({ ...this.state, location: newLocation, initialized: true, doesKeyExist: key, finishedInput: false });
				}
				this.setState({ ...this.state, location: newLocation, initialized: true, doesKeyExist: key });
			});
		// }, err => {
			// console.log(err);
		// });

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
		if (event.target) {
			const name = event.target.name;

			if (name === 'price') {
		    if (event.target.checked) {
		    	event.target.nextSibling.classList.add(classes.active);
		    } else {
		    	event.target.nextSibling.classList.remove(classes.active);
		    }
			}
			this.setState({ ...this.state, [name]: event.target.value });
		} else {
			console.log(event);
			this.setState({ ...this.state, radius: event });
		}
	}

	onSubmitData(data) {
		const id = this.props.idKey;
		const db = this.props.db.database().ref(`numPeople/${id}`);

		db.once('value', async snapshot => {
			let response;
			const value = snapshot.val();

			if (value.inputs < value.numPeople) {
				const newData = { ...value };
				newData.inputs += 1;

				if (!newData.restaurants) {
					newData.restaurants = [];
				}
				response = await axios.get(`${url}api/detail/?id=${data[0].props.compData.id}`);
				newData.restaurants.push(Object.assign(data[0].props.compData, response.data));
				
				response = await axios.get(`${url}api/detail/?id=${data[1].props.compData.id}`);
				newData.restaurants.push(Object.assign(data[1].props.compData, response.data));

				db.update(newData, error => {
					// set this browser to valid browser
					localStorage.setItem(`foodgo_input_${id}`, 1);
					
					// on value change
					db.on('value', dataSnapshot => {
						const updatedData = dataSnapshot.val();
						console.log('updated:', updatedData);
						if (updatedData.inputs === updatedData.numPeople) {
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

	keyFull = (
		<h1 style={{ textAlign: 'center' }}>
			This group is full!
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
							<div className={classes.price_input_wrapper}>
								<div style={{ width: 60, position: 'relative' }}>
									<label style={{ transform: 'translateX(-6px)' }} htmlFor="price1">$</label>
									<input type="radio" name="price" id="price1" value="1" className={`${classes.price_input} ${classes.checkbox}`} 
										onChange={this.onInputChange}
										checked={this.state.price === '1'}
									/>
									<span className={`${classes.checkbox_span} ${this.state.price === '1' ? classes.active : ''}`}>
										<span className={classes.checkbox_check} />
									</span>
								</div>

								<div style={{ width: 60, position: 'relative' }}>
									<label style={{ transform: 'translateX(-14px)' }} htmlFor="price2">$$</label>
									<input type="radio" name="price" id="price2" value="1, 2" className={`${classes.price_input} ${classes.checkbox}`}
										onChange={this.onInputChange}
										checked={this.state.price === '1, 2'}
									/>
									<span className={`${classes.checkbox_span} ${this.state.price === '1, 2' ? classes.active : ''}`}>
										<span className={classes.checkbox_check} />
									</span>
								</div>

								<div style={{ width: 60, position: 'relative' }}>
									<label style={{ transform: 'translateX(-22px)' }} htmlFor="price3">$$$</label>
									<input type="radio" name="price" id="price3" value="1, 2, 3" className={`${classes.price_input} ${classes.checkbox}`} 
										onChange={this.onInputChange}
										checked={this.state.price === '1, 2, 3'}
									/>
									<span className={`${classes.checkbox_span} ${this.state.price === '1, 2, 3' ? classes.active : ''}`}>
										<span className={classes.checkbox_check} />
									</span>
								</div>
							</div>
							<br />
							<br />

							<label htmlFor="distance" className={`${classes.distance} ${classes.label}`}>Distance</label>
							<div style={{ width: '100%', margin: '0 0 40px 0' }} className={classes.slider_input_wrapper}>
								<p className={classes.p} style={{ margin: '10px 0 10px 0', padding: 0, paddingLeft: 10 }}>{this.state.radius} mi</p>
								<Slider name="radius" id="radius" min={1} max={25} 
									value={this.state.radius} 
									onChange={this.onInputChange} 
									railStyle={{ height: 6 }}
									dotStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' }}
									activeDotStyle={{ backgroundColor: 'rgba(0,0,0,0)', borderColor: 'rgba(0,0,0,0)' }}
									trackStyle={{ backgroundColor: 'rgba(255,138,128,0.5)', height: 6 }}
									handleStyle={{
										borderColor: '#FF8A80',
										borderWidth: 2,
										height: 16,
										width: 16,
					          marginLeft: -6,
          					marginTop: -6
									}}
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
			if (this.state.fullRoom) {
				return this.keyFull;
			}
			return KeyExists;
		}
		return this.KeyDoesntExist;
	}
}

export default withRouter(InputPref);
