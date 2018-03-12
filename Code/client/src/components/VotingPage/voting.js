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
      vote: [],
      restVotes: [], 
    };

    this.onChoiceClick = this.onChoiceClick.bind(this);
    this.doneVoting = this.doneVoting.bind(this);
  }

  componentDidMount() {
    const id = this.props.idKey;
    const db = this.props.db.database().ref(`numPeople`);

    db.once('value', snapshot => {
      const key = snapshot.hasChild(id);
      if (key) {
        const value = snapshot.child(id).val();

        if (value.votes >= value.numPeople) {
          return this.props.history.push(`/${id}/result`);
        }

        if (value.inputs < value.numPeople) {
          if (!localStorage.getItem(`foodgo_input_${id}`)) {
            return this.props.history.push(`/${id}`);
          }
        }

        this.setState({ ...this.state, length: value.restaurants.length, cards: value.restaurants, initialized: true });        
      } else {
        this.props.history.push('/');
      }
    });
  }

  doneVoting(data) {
    const id = this.props.idKey;
    const db = this.props.db.database().ref(`numPeople/${id}`);

    db.once('value', snapshot => {
      const value = snapshot.val();
      const newData = { ...value };
      newData.votes += 1;
      if (newData.votes === newData.numPeople) {
        newData.seenResult = 0;
      }

      for(var i = 0; i<this.state.restVotes.length; i++){
        if (this.state.restVotes[i] === 1) {
          newData.restaurants[i].totVotes++;
        }
      }
      db.update(newData, error => {
        // set this browser to valid browser
        localStorage.setItem(`foodgo_vote_${id}`, 1);
        
        // on value change
        db.on('value', dataSnapshot => {
          const updatedData = dataSnapshot.val();
          console.log('updated:', updatedData);
          if (updatedData.votes === updatedData.numPeople) {
            this.props.history.push(`/${id}/result`);
            db.off('value');
          }
        });
        
        this.setState({ ...this.state, showOutput: false, finishedVote: true });
      });
    })
  }

  onChoiceClick(event) {
    //yes or no
    const value = event.currentTarget.getAttribute('value');

    const cards = document.getElementsByClassName(classes.card_item);
    const topCard = cards[cards.length-1];
    topCard.classList.add(classes[`animation_${value}`]);

    const index = topCard.getAttribute('index');
    const state = { ...this.state };
    //copies votes and adds new vote
    const newVote = state.vote.concat({ data: state.cards[index], vote: value });
    //copies cards
    const newCards = state.cards.slice();
    newCards.pop();
    const restVotes = state.restVotes.slice();
    if (value === "yes") {
      restVotes[index] = 1;
    } else {
      restVotes[index] = 0;
    }

    setTimeout((state, newCards, newVote, index, restVotes) => {
      this.setState({ ...state, cards: newCards, vote: newVote, index: index+1, restVotes: restVotes});

      if (newVote.length === this.state.length) {
        this.doneVoting(newVote);
      }
    }, 275, state, newCards, newVote, index, restVotes);
  }

  waitingOnOthers = (
    <div>
      <h1 style={{ textAlign: 'center', margin: '1em' }}>
        Thanks for your vote.
      </h1>
      <h3 style={{ textAlign: 'center' }}>
        Waiting on others       
      </h3>
      <br/>
      <div className={classes.loading}>
        <svg className={classes.circular} viewBox="25 25 50 50">
          <circle className={classes.path} cx="50" cy="50" r="20" fill="none" strokeWidth="3" strokeMiterlimit="10"/>
        </svg>
      </div>
    </div>
  )

  render() {
    console.log(this);
    if (!this.state.initialized) {
      return '';
    }

    if (this.state.finishedVote) {
      return this.waitingOnOthers;
    }

    const cardList = [];
    cardList.push(<div style={{ position: 'relative', opacity: 0 }} className={classes.card_item} key={-1} />);
    for (let i = 0; i < this.state.cards.length; i++) {
      cardList.push(<Card compData={this.state.cards[i]} index={i} key={i} />);
    }

    return (
      <div className={classes.wrapper}>
        <h1 className={classes.wrapper_title} style={{ textAlign: 'center', margin: 0, paddingTop: '20px' }}>Swipe to vote.</h1>
        <div className={classes.card_wrapper}>
          <span className={`${classes.choice} ${classes.no}`}
            id="choice_no"
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
            id="choice_yes"
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