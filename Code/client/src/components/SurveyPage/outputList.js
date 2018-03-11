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
      loadAct: false,
      submitLoad: false
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

    console.log(this);
    axios.get(`${url}api/search/?categories=${data.categories}&price=${data.price}&radius=${data.radius}&lat=${location.lat}&lng=${location.lng}&offset=${this.state.list.length}`)
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
      this.overlay.classList.add(classes.hide);
      setTimeout(this.props.compClose, 300);
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
      this.setState({ ...this.state, submitLoad: true });
      this.props.compSubmit(this.state.selected);
    }
  }

  load = (
    <div className={classes.showbox}>
      <svg className={classes.circular} viewBox="25 25 50 50">
        <circle className={classes.path} cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"/>
      </svg>
    </div>
  );

  render() {
    console.log(this);

    let button = (
      <button className={classes.submit}
        onClick={this.onSubmitClick}
      >
        Submit
      </button>
    );

    if (this.state.submitLoad) {
      button = (
        <div className={classes.showbox} style={{ transform: 'translateY(-5px)', padding: 0, height: '39.2px', margin: '30px auto 0' }}>
          <svg className={classes.circular} viewBox="25 25 50 50">
            <circle className={classes.path} cx="50" cy="50" r="20" fill="none" strokeWidth="4" strokeMiterlimit="10"/>
          </svg>
        </div>
      );
    }

    return (
      <div className={classes.overlay}
        onClick={this.onOverlayClose}
        ref={input => {this.overlay = input}}
      >
        <div className={classes.items_wrapper}>
          <div className={classes.items_close}
            onClick={this.onOverlayClose}
          >
            <svg width="14" height="14" viewBox="0 0 14 14">
              <path d="M 14 1.41L 12.59 0L 7 5.59L 1.41 0L 0 1.41L 5.59 7L 0 12.59L 1.41 14L 7 8.41L 12.59 14L 14 12.59L 8.41 7L 14 1.41Z"/>
            </svg>
          </div>
          <h2 className={classes.items_title}>Select 2 restaurants</h2>
          
          <div className={classes.restaurant_wrapper}
            onScroll={this.onItemsScroll}
          >
            {this.state.list}
            {this.state.load ? this.load : ''}
          </div>
          
          {button}
        </div>
      </div>
    );
  }
}

export default OutputList;
