import React, { Component } from 'react';

import classes from './styles.css';

class RestaurantItem extends Component {
  constructor(props) {
    super(props);

    this.state = { selected: false };

    this.onItemClick = this.onItemClick.bind(this);
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

  onItemClick() {
    if (this.state.selected) {
      this.props.compUnselect(this.props.compIndex);
      this.setState({ selected: false });
    } else {
      this.props.compSelect(this.props.compIndex);
      this.setState({ selected: true });
    }
  }

  render() {
    console.log(this.props);
    const data = this.props.compData;

    const stars = [];
    let i, rate = Math.trunc(data.rating);
    for (i = 0; i < rate; i++)
      stars.push(<span key={i}>{this.renderFullstar}</span>);

    if (data.rating % 1 !== 0)
      stars.push(<span key={stars.length}>{this.renderHalfstar}</span>);
    
    while (stars.length < 5)
      stars.push(<span key={stars.length}>{this.renderEmptystar}</span>);

    return (
      <div className={`${classes.restaurant_item_wrapper} ${this.state.selected ? classes.selected : ''}`}
        onClick={this.onItemClick}
      >
        <img className={classes.restaurant_img} src={data.image_url} alt={data.id} />

        <div className={classes.restaurant_main}>
          <h4>{data.name}</h4>
  
          <div className={classes.restaurant_ratings_wrapper}>
            <span>
              <span style={{ marginRight: '5px' }}>{stars}</span>
              {data.review_count} Reviews
            </span>  
          </div>

          <p className={classes.restaurant_location}>
            {data.location.display_address.join(', ')}
          </p>
        </div>

        <aside className={classes.restaurant_aside}>
          <div className={classes.restaurant_category}>
            {`${data.categories[0].title} – ${data.price || 'none'}`}
          </div>

          <div className={classes.restaurant_distance}>
            {Math.round(data.distance/1609.34)} mi
          </div>
        </aside>
      </div>
    );
  }
}

export default RestaurantItem;