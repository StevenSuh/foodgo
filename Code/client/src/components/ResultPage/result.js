import React, { Component } from 'react';
import Card from '../VotingPage/card';

class Result extends Component {
	constructor(props){
		super(props);
		this.state = {
			choice : {},
			max : 0
		}
	}
	
	render(){
    const db = this.props.db.database().ref('numPeople/' + this.props.idKey);
    db.once('value', snapshot => {
      const value = snapshot.val();
      for(var i = 0; i < value.restaurants.length; i++){
        if(value.restaurants[i].totVotes > this.state.max){
          this.setState({choice:value.restaurants[i], max: value.restaurants[i].totVotes});
          console.log("THIS IS WORKING");
        }
      }
    })
    console.log(this.state);
		if(this.state.max > 0){
			return(
        <div margin-top="100px">
          <Card compData={this.state.choice} index={0} key={0} />
        </div>
			)
		} else {
			return(
        <div>
          YOU ARE ALL INDECISIVE
        </div>
			)
		}
	}
}

export default Result;