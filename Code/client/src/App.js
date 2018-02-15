import React, { Component } from 'react';
import firebase from 'firebase';
import './App.css';
import { Route, Switch } from 'react-router-dom';
import LandingPage from './components/LandingPage';

class App extends Component {

	constructor(props){
		super(props);
		var config = {
    	apiKey: "AIzaSyAOI3QVtML3Wp8ywmYbY33M6ZPfWiuc_EU",
    	authDomain: "foodgo-e0ea4.firebaseapp.com",
    	databaseURL: "https://foodgo-e0ea4.firebaseio.com",
    	projectId: "foodgo-e0ea4",
    	storageBucket: "foodgo-e0ea4.appspot.com",
    	messagingSenderId: "213420997820"
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
