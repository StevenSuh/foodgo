import React, { Component } from 'react';
import axios from 'axios';

import RestaurantItem from './restaurantItem';

import classes from './styles.css';

class OutputList extends Component {
  constructor(props) {
    super(props);

    this.state = { list: [], load: false };

    this.onOverlayClose = this.onOverlayClose.bind(this);
  }

  componentDidMount() {
    const data = this.props.compData;
    const location = this.props.compLocation;
    axios.get(`http://localhost:3000/api/search/?categories=${data.categories}&price=${data.price}&radius=${data.radius}&lat=${location.lat}&lng=${location.lng}`)
      .then(response => {
        // list
        console.log(response);
        this.setState({ list: response.data, load: Boolean(response.data.length < 10) });
      });
  }

  onOverlayClose(event) {
    if (event.target === event.currentTarget) {
      this.props.compClose();
    }
  }

  render() {
    const items = [];
    const list = this.state.list;

    for (let i = 0; i < list.length; i++) {
      items.push(
        <RestaurantItem
          compData={list[i]}
        />
      );
    }

    let load = '';
    if (this.state.load) {
      load = '';
    }

    return (
      <div className={classes.overlay}
        onClick={this.onOverlayClose}
      >
        <div className={classes.items_wrapper}>
          <h2 className={classes.items_title}>Select up to 2 restaurants</h2>
          
          <div className={classes.restaurant_wrapper}>
            {items}
            {load}
          </div>
          
          <button className={classes.submit}>
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default OutputList;
