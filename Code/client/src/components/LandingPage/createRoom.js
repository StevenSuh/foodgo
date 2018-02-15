import React, { Component } from 'react';
import RoomModal from './roomModal';

import classes from './styles.css';

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    this.state = { term: '', showPopUp: false, roomKey: '' };

    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
  }

  // controlled input
  onInputChange(event) {
    this.setState({ ...this.state, term: event.target.value });
  }

  // when createRoom is clicked
  onButtonClick() {
    let dbCon = this.props.db.database().ref('/numPeople');
    const dbConRef = dbCon.push({
      numPeople: this.state.term
    });

    // display popup
    this.setState({ ...this.state, showPopUp: true, roomKey: dbConRef.key });
  }

  renderPopUp() {
    if (this.state.showPopUp) {
      return (
        <RoomModal compKey={this.state.roomKey} />
      );
    }
    return;
  }

  render() {
    console.log(this.props);
    console.log('styles:', classes);
    return (
      <div className="createRoom">
        <h6 className="createRoom_title">
          Choose your restaurant.
        </h6>

        <div className="createRoom_container">
          <div className="createRoom_container_wrapper">
            <div className="createRoom_input_wrapper">
              <input 
                id="createRoom_input" 
                type="number" 
                placeholder="# Number of People" 
                onChange={this.onInputChange}
                value={this.state.term}
              />
            </div>

            <button 
              id="createRoom_button"
              onClick={this.onButtonClick}
            >
              Create Room
            </button>
          </div>
        </div>

        <p className="createRoom_belowText">
          or <span className="createRoom_belowText_underlined">Join a Room</span>
        </p>
      </div>
    );
  }
}

export default CreateRoom;