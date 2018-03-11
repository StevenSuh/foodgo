import React, { Component } from 'react';

import classes from './styles.css';

class ImgSlide extends Component {
  constructor(props) {
    super(props);

    this.state = { index: 0 };

    this.onImgSwap = this.onImgSwap.bind(this);
  }

  onImgSwap() {
    this.img.classList.add(classes.hide);
    setTimeout(() => {
      this.img.classList.remove(classes.hide);
      this.setState({ ...this.state, index: (this.state.index+1) % this.props.compPhotos.length });
    }, 300);
  }

  render() {
    return (
      <div className={classes.card_img_slide} onClick={this.onImgSwap}>
        <img ref={input => {this.img = input}} className={classes.card_img} src={this.props.compPhotos[this.state.index]} alt={this.state.index} />
      </div>
    );
  }
}

export default ImgSlide;