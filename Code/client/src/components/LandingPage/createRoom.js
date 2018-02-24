import React, { Component } from 'react';
import RoomModal from './roomModal';

import classes from './styles.css';

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    this.state = { term: '', showPopUp: false, roomKey: '' };

    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
  }

  // controlled input
  onInputChange(event) {
    this.setState({ ...this.state, term: event.target.value });
  }

  // when createRoom is clicked
  onButtonClick() {
    let dbCon = this.props.db.database().ref('/numPeople');
    const dbConRef = dbCon.push({
      numPeople: this.state.term,
      currPeople: 0
    });

    // display popup
    this.setState({ ...this.state, showPopUp: true, roomKey: dbConRef.key });
  }

  onOverlayClick(event) {
    if (event.target === event.currentTarget) {
      this.setState({ ...this.state, showPopUp: false });
    }
  }

  renderModal() {
    if (this.state.showPopUp) {
      return (
        <RoomModal compKey={this.state.roomKey} onCompClick={this.onOverlayClick} />
      );
    }
    return;
  }

  render() {
    console.log(this.props);
    return (
      <div className={classes.createRoom}>
        <h6 className={classes.createRoom_title}>
          Choose your restaurant.
        </h6>

        <div className={classes.createRoom_container}>
          <div className={classes.createRoom_container_wrapper}>
            <div className={classes.createRoom_input_wrapper}>
              <input 
                id={classes.createRoom_input}
                type="number" 
                placeholder="# Number of People" 
                onChange={this.onInputChange}
                value={this.state.term}
              />
            </div>

            <button 
              id={classes.createRoom_button}
              onClick={this.onButtonClick}
            >
              Create Room
            </button>
          </div>
        </div>

        <p className={classes.createRoom_belowText}>
          or <span className={classes.createRoom_belowText_underlined}>Join a Room</span>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}

export default CreateRoom;