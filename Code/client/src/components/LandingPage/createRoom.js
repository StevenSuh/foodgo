import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';
import ReactDOM from 'react-dom';
import RoomModal from './roomModal';

import classes from './styles.css';

class CreateRoom extends Component {
  constructor(props) {
    super(props);

    this.state = { term: '', showPopUp: false, roomKey: '' };

    this.onInputChange = this.onInputChange.bind(this);
    this.onButtonClick = this.onButtonClick.bind(this);
    this.onOverlayClick = this.onOverlayClick.bind(this);
    this.redirectToRoom = this.redirectToRoom.bind(this);
  }

  // controlled input
  onInputChange(event) {
    this.setState({ ...this.state, term: event.target.value });
  }

  // when createRoom is clicked
  onButtonClick(event) {
    event.preventDefault();
    if (!this.state.showPopUp) {
      if (this.state.term) {
        let dbCon = this.props.db.database().ref('/numPeople');
        const dbConRef = dbCon.push({
          numPeople: parseInt(this.state.term, 10),
          votes: 0,
          inputs: 0
        });

        // display popup
        this.setState({ ...this.state, showPopUp: true, roomKey: dbConRef.key });
      }
    } else {
      const goToRoom = document.getElementById('go_to_room');

      if (goToRoom) {
        goToRoom.click();
      }
    }
  }

  onOverlayClick() {
    this.setState({ ...this.state, showPopUp: false });
  }

  redirectToRoom() {
    this.onOverlayClick();
    this.props.history.push(`/${this.state.roomKey}`);
  }

  renderModal() {
    if (this.state.showPopUp) {
      ReactDOM.render(<RoomModal compKey={this.state.roomKey} onCompClick={this.onOverlayClick} onRedirect={this.redirectToRoom} />,
        document.getElementById('modal'));
    } else {
      ReactDOM.render(null, document.getElementById('modal'));      
    }
  }

  render() {
    console.log(this.props);
    return (
      <div className={classes.createRoom}>
        <h6 className={classes.createRoom_title}>
          Choose your restaurant.
        </h6>

        <div className={classes.createRoom_container}>
          <form className={classes.createRoom_container_wrapper}>
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
          </form>
        </div>

        <p className={classes.createRoom_belowText}>
          or <span className={classes.createRoom_belowText_underlined}>Join a Room</span>
        </p>
        {this.renderModal()}
      </div>
    );
  }
}

export default withRouter(CreateRoom);