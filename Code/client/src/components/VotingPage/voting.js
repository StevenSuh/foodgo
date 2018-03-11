import React, { Component } from 'react';
import { withRouter } from 'react-router-dom';

import Card from './card';

import classes from './styles.css';

class Voting extends Component {
  constructor(props) {
    super(props);

    this.state = { 
      length: 0, 
      cards: [], 
      initialized: false, 
      vote: [] 
    };

    this.onChoiceClick = this.onChoiceClick.bind(this);
    this.doneVoting = this.doneVoting.bind(this);
  }

  componentDidMount() {
    const id = this.props.idKey;
    const db = this.props.db.database().ref(`numPeople/${id}`);

    db.once('value', snapshot => {
      const value = snapshot.val();

      if (value.votes >= value.numPeople) {
        return this.props.history.push(`/${id}/go`);
      }
      this.setState({ ...this.state, length: value.restaurants.length, cards: value.restaurants, initialized: true });
    });
  }

  doneVoting(data) {
    const id = this.props.idKey;
    const db = this.props.db.database().ref(`numPeople/${id}`);

    db.once('value', snapshot => {
      const value = snapshot.val();
      const newData = { ...value };
      newData.votes += 1;

      db.update(newData, error => {
        // set this browser to valid browser
        localStorage.setItem(`foodgo_vote_${id}`, 1);
        
        // on value change
        db.on('value', dataSnapshot => {
          const updatedData = dataSnapshot.val();
          console.log('updated:', updatedData);
          if (updatedData.votes === updatedData.numPeople) {
            this.props.history.push(`/${id}/go`);
            db.off('value');
          }
        });
        
        this.setState({ ...this.state, showOutput: false, finishedInput: true });
      });
    })
  }

  onChoiceClick(event) {
    const value = event.currentTarget.getAttribute('value');

    const cards = document.getElementsByClassName(classes.card_item);
    const lastCard = cards[cards.length-1];
    lastCard.classList.add(classes[`animation_${value}`]);

    const index = lastCard.getAttribute('index');
    const state = { ...this.state };
    const newVote = state.vote.concat({ data: state.cards[index], vote: value });
    const newCards = state.cards.slice();
    newCards.shift();

    setTimeout((lastCard, state, newCards, newVote, index) => {
      lastCard.classList.remove(classes[`animation_${value}`]);

      this.setState({ ...state, cards: newCards, vote: newVote, index: index+1 });

      if (newVote.length === this.state.length) {
        this.doneVoting(newVote);
      }
    }, 275, lastCard, state, newCards, newVote, index);
  }

  render() {
    if (!this.state.initialized) {
      return '';
    }

    const cardList = [];
    cardList.push(<div style={{ position: 'relative', opacity: 0 }} className={classes.card_item} key={-1} />);
    for (let i = this.state.cards.length-1; i >= 0; i--) {
      cardList.push(<Card compData={this.state.cards[i]} index={i} key={i} />);
    }

    return (
      <div className={classes.wrapper}>
        <h1 style={{ textAlign: 'center', margin: 0, marginTop: '20px' }}>Swipe to vote.</h1>
        <div className={classes.card_wrapper}>
          <span className={`${classes.choice} ${classes.no}`}
            onClick={this.onChoiceClick}
            value="no"
          >
            <svg width="47" height="75" viewBox="0 0 47 75">
              <path d="M 46.3125 66.125L 17.6875 37.5L 46.3125 8.8125L 37.5 0L 0 37.5L 37.5 75L 46.3125 66.125Z"/>
            </svg>
            <br/>
            No
          </span>
          <span style={{ position: 'relative' }}>
            {cardList}
          </span>
          <span className={classes.choice}
            onClick={this.onChoiceClick}
            value="yes"
          >
            <svg width="47" height="75" viewBox="0 0 47 75">
              <path d="M 9.53674e-07 66.125L 28.625 37.5L 9.53674e-07 8.8125L 8.8125 0L 46.3125 37.5L 8.8125 75L 9.53674e-07 66.125Z"/>
            </svg>
            <br/>
            Yes
          </span>
        </div>
      </div>
    );
  }
}

export default withRouter(Voting);