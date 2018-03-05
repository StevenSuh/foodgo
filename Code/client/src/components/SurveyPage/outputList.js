import React, { Component } from 'react';
import axios from 'axios';

import RestaurantItem from './restaurantItem';

import classes from './styles.css';

import url from '../../url';

class OutputList extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      list: [], 
      selected: [],
      load: false, 
      loadAct: false 
    };
    this.items = [];

    this.onOverlayClose = this.onOverlayClose.bind(this);
    this.onItemsScroll = this.onItemsScroll.bind(this);
    this.onLoadMore = this.onLoadMore.bind(this);

    this.onItemSelect = this.onItemSelect.bind(this);
    this.onItemUnselect = this.onItemUnselect.bind(this);

    this.onSubmitClick = this.onSubmitClick.bind(this);
  }

  componentDidMount() {
    this.onLoadMore();
  }

  onLoadMore() {
    const data = this.props.compData;
    const location = this.props.compLocation;
    axios.get(`${url}/api/search/?categories=${data.categories}&price=${data.price}&radius=${data.radius}&lat=${location.lat}&lng=${location.lng}&offset=${this.state.list.length}`)
      .then(response => {
        // list
        console.log(response);

        const items = [];
        const list = response.data;

        for (let i = 0; i < list.length; i++) {
          items.push(
            <RestaurantItem 
              key={i + this.state.list.length} 
              compIndex={i + this.state.list.length}
              compData={list[i]} 
              compSelect={this.onItemSelect}
              compUnselect={this.onItemUnselect}
              ref={input => this.items.push(input)}
            />
          );
        }
        this.setState({ 
          ...this.state, 
          list: this.state.list.concat(items), 
          load: Boolean(list.length === 10 && this.state.list.length < 100), 
          loadAct: Boolean(list.length !== 10 || this.state.list.length >= 100) 
        });
      });
  }

  onOverlayClose(event) {
    if (event.target === event.currentTarget) {
      this.props.compClose();
    }
  }

  onItemsScroll({ currentTarget }) {
    const loadHeight = 100;
    const height = currentTarget.scrollHeight-currentTarget.offsetHeight;

    if (!this.state.loadAct) {
      if (currentTarget.scrollTop >= height-loadHeight) {
        this.setState({ ...this.state, loadAct: true });
        this.onLoadMore();
      }
    }
  }

  onItemSelect(index) {
    const selected = this.state.selected.slice();
    if (selected.length === 2) {
      const deleted = selected.shift();

      const item = this.items[parseInt(deleted.key, 10)];
      item.setState({ ...item.state, selected: false });
    }
    selected.push(this.state.list[index]);
    this.setState({ ...this.state, selected: selected });
  }

  onItemUnselect(index) {
    const selected = this.state.selected;
    if (selected.length > 0) {
      const list = [];
      
      for (let i = 0; i < selected.length; i++) {
        if (selected[i] !== this.state.list[index]) {
          list.push(selected[i]);
        }
      }

      this.setState({ ...this.state, selected: list });
    }
  }

  onSubmitClick() {
    if (this.state.selected.length === 2) {
      this.props.compSubmit(this.state.selected);
    }
  }

  load = (
    <div className={classes.showbox}>
      <svg className={classes.circular} viewBox="25 25 50 50">
        <circle className={classes.path} cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10"/>
      </svg>
    </div>
  );

  render() {
    console.log(this);

    return (
      <div className={classes.overlay}
        onClick={this.onOverlayClose}
      >
        <div className={classes.items_wrapper}>
          <h2 className={classes.items_title}>Select 2 restaurants</h2>
          
          <div className={classes.restaurant_wrapper}
            onScroll={this.onItemsScroll}
          >
            {this.state.list}
            {this.state.load ? this.load : ''}
          </div>
          
          <button className={classes.submit}
            onClick={this.onSubmitClick}
          >
            Submit
          </button>
        </div>
      </div>
    );
  }
}

export default OutputList;
