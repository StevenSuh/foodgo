import React, { Component } from 'react';

class CreateRoom extends Component {
  render() {
    return (
      <div className="createRoom">
        <h6 className="createRoom_title">
          Choose your restaurant.
        </h6>

        <div className="createRoom_container">
          <div className="createRoom_container_wrapper">
            <div className="createRoom_input_wrapper">
              <input id="createRoom_input" type="number" placeholder="# Number of People" />
            </div>

            <button 
              id="createRoom_button"
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