import React, { Component } from 'react';
import Draggable from 'react-draggable';
import ImgSlide from './imgSlide';

import classes from './styles.css';

class Card extends Component {
  constructor(props) {
    super(props);

    this.state = { expand: false, position: { x: 0, y: 0 } };

    this.expandCard = this.expandCard.bind(this);

    this.dragStop = this.dragStop.bind(this);
    this.dragControlled = this.dragControlled.bind(this);
  }

  renderFullstar = (
    <svg className={classes.star} width="20" height="20" viewBox="0 0 20 20">
      <path d="M 10 15.5049L 16.18 19.2923L 14.54 12.1542L 20 7.35138L 12.81 6.72185L 10 0L 7.19 6.72185L 0 7.35138L 5.45 12.1542L 3.82 19.2923L 10 15.5049Z"/>
    </svg>
  );

  renderHalfstar = (
    <svg className={classes.star} width="20" height="20" viewBox="0 0 20 20">
      <path d="M 10 13.6062L 10 4.16308L 11.71 8.25508L 16.09 8.63077L 12.77 11.5652L 13.76 15.9111L 10 13.6062ZM 20 7.35138L 12.81 6.732L 10 0L 7.19 6.732L 0 7.35138L 5.45 12.1542L 3.82 19.2923L 10 15.5049L 16.18 19.2923L 14.54 12.1542L 20 7.35138Z"/>
    </svg>
  );

  renderEmptystar = (
    <svg className={classes.star} width="20" height="20" viewBox="0 0 20 20">
      <path d="M 10 13.596L 6.24 15.9009L 7.23 11.5551L 3.91 8.63077L 8.29 8.25508L 10 4.15292L 11.71 8.25508L 16.09 8.63077L 12.77 11.5551L 13.76 15.9009L 10 13.596ZM 20 7.35138L 12.81 6.732L 10 0L 7.19 6.732L 0 7.35138L 5.45 12.1542L 3.82 19.2923L 10 15.5049L 16.18 19.2923L 14.54 12.1542L 20 7.35138Z"/>
    </svg>
  );

  arrow = (
    <svg width="30" height="19" viewBox="0 0 30 19">
      <path d="M 3.525 18.525L 15 7.075L 26.475 18.525L 30 15L 15 0L 0 15L 3.525 18.525Z"/>
    </svg>
  );

  expandCard(event) {
    this.setState({ ...this.state, expand: !this.state.expand });
  }

  dragStart() {
  }

  dragStop(e) {
    // e.currentTarget.classList.remove(classes.drag);
    const { x } = this.state.position;
    const card = this.card;
    if (Math.abs(x) >= card.clientWidth*0.75) {
      if (x < 0) {
        card.setAttribute('animation', 'swipe_no');
        document.getElementById('choice_no').click();
      } else {
        card.setAttribute('animation', 'swipe_yes');
        document.getElementById('choice_yes').click();
      }
    } else {
      this.setState({ ...this.state, position: { x: 0, y: 0 } });
    }
  }

  dragControlled(e, position) {
    const { x, y } = this.state.position;
    this.setState({ 
      ...this.state, 
      position: {
        x: x + position.deltaX,
        y: y + position.deltaY
      } 
    });
  }

  render() {
    const data = this.props.compData;

    const stars = [];
    let i, rate = Math.trunc(data.rating);
    for (i = 0; i < rate; i++)
      stars.push(<span key={i}>{this.renderFullstar}</span>);

    if (data.rating % 1 !== 0)
      stars.push(<span key={stars.length}>{this.renderHalfstar}</span>);
    
    while (stars.length < 5)
      stars.push(<span key={stars.length}>{this.renderEmptystar}</span>);

    const reviews = [];
    for (i = 0; i < data.reviews.length; i++) {
      const reviewStars = [];
      let j, rating = Math.trunc(data.reviews[i].rating);
      for (j = 0; j < rating; j++)
        reviewStars.push(<span key={j}>{this.renderFullstar}</span>);

      if (data.reviews[i].rating % 1 !== 0)
        reviewStars.push(<span key={reviewStars.length}>{this.renderHalfstar}</span>);
      
      while (reviewStars.length < 5)
        reviewStars.push(<span key={reviewStars.length}>{this.renderEmptystar}</span>);

      reviews.push(
        <p key={i}><br/>{data.reviews[i].text} – {reviewStars}<br/></p>
      );
    }

    return (
      <Draggable position={this.state.position} onStart={this.dragStart} onStop={this.dragStop} onDrag={this.dragControlled}>
        <div ref={input => {this.card = input}} index={this.props.index} className={`${classes.card_item} ${this.state.expand ? classes.expand : ''}`}>
          <ImgSlide compPhotos={data.photos} />

          <div className={classes.card_bottom}>
            <h2 className={classes.card_title}>
              {data.name}
            </h2>
      
            <div className={classes.card_ratings_wrapper}>
              <span>
                <span style={{ marginRight: '5px' }}>{stars}</span>
                {data.review_count} Reviews
              </span>  
            </div>

            <div className={`${classes.card_hide} ${this.state.expand ? classes.expand : ''}`}>
              <div className={classes.card_left_aside}>
                {data.location.display_address.join(', ')}
              </div>
              <aside className={classes.card_aside}>
                <div className={classes.card_category}>
                  {`${data.categories[0].title} – ${data.price || 'none'}`}
                </div>
              </aside>
              <p className={classes.card_location}>
                {Math.round(data.distance/1609.34)} mi
              </p>
              {reviews}
            </div>
          </div>

          <button className={classes.card_expand}
            onClick={this.expandCard}
          >
            {this.arrow}
          </button>
        </div>
      </Draggable>
    );
  }
}

export default Card;