import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ResultCard from './resultCard';

class Result extends Component {
	constructor(props){
		super(props);
		this.state = {
			choice : {},
			maxIndex : -1,
      initialized: false
		}
	}

  componentDidMount() {
    const roomId = this.props.idKey;
    const db = this.props.db.database().ref('numPeople');
    db.once('value', async snapshot => {
      const key = snapshot.hasChild(roomId);

      if (key) {
        const value = snapshot.child(roomId).val();

        if (value.votes < value.numPeople) {
          return this.props.history.push(`/${roomId}/vote`);
        }

        if (!localStorage.getItem(`foodgo_vote_${roomId}`)) {
          return this.props.history.push(`/`);
        }

        let maxI = 0;
        for(var i = 1; i < value.restaurants.length; i++){
          if(value.restaurants[i].totVotes > value.restaurants[maxI].totVotes){
            maxI = i;
          }
        }
        console.log(maxI);
        if (value.restaurants[maxI].totVotes > 0) {
          const room = this.props.db.database().ref(`numPeople/${roomId}`);

          if (value.seenResult === value.numPeople-1) {
            room.remove();
          } else {
            value.seenResult += 1;
            await room.update(value);
          }
          
          this.setState({ 
            ...this.state, 
            choice: value.restaurants[maxI], 
            maxIndex: maxI,
            initialized: true
          });
        } else {
          this.setState({ ...this.state, initialized: true });
        }
      } else {
        this.props.history.push('/');
      }
    });
  }
	
	render(){
    if (this.state.initialized) {
      if(this.state.maxIndex > -1){
        return(
          <div>
            <ResultCard compData={this.state.choice} index={0} />
          </div>
        )
      }
      return (
        <h1 style={{ textAlign: 'center' }}>
          YOU ARE ALL INDECISIVE
        </h1>
      );
    }

    return '';
	}
}

export default withRouter(Result);