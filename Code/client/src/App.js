import React, { Component } from 'react';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage';
import firebase from 'firebase';

class App extends Component {

	constructor(props){
		super(props);
		var config = {
    	apiKey: "AIzaSyDfsooMGN2vGynbZGnlNiX7EcHoZJf76Ec",
    	authDomain: "foodgo-39530.firebaseapp.com",
    	databaseURL: "https://foodgo-39530.firebaseio.com",
    	projectId: "foodgo-39530",
    	storageBucket: "foodgo-39530.appspot.com",
    	messagingSenderId: "132265046668"
  	};
  	firebase.initializeApp(config);
	}
  render() {
    return (
      <Switch>
        <Route path='/' exact component={() => <LandingPage db = {firebase}/>}/>
      </Switch>
    );
  }
}

export default App;
