import React from 'react';

import classes from './styles.css';

function onCopyClick(event) {
  const range = document.createRange();
  const selection = window.getSelection();

  range.selectNodeContents(event.currentTarget.nextSibling);
  selection.removeAllRanges();
  selection.addRange(range);
  document.execCommand('Copy');
}

export default (props) => {
  const onRedirect = (event) => {
    event.preventDefault();
    document.getElementById('room_overlay').classList.add(classes.hide);
    setTimeout(props.onRedirect, 300);
  }

  const onOverlayClick = (event) => {
    document.getElementById('room_overlay').classList.add(classes.hide);

    if (event.target === event.currentTarget) {
      setTimeout(props.onCompClick, 300);
    }
  }

  return (
    <div id="room_overlay" className={classes.room_modal_overlay} onClick={onOverlayClick}>
      <div className={classes.room_modal}>
        <div className={classes.room_modal_wrapper}>
          <h4>Successfully created a room!</h4>

          <span>
            <span 
              className={classes.room_modal_copyIcon}
              onClick={onCopyClick}
            >
              <svg width="19" height="22" viewBox="0 0 19 22">
                <path d="M 17 20L 6 20L 6 6L 17 6L 17 20ZM 17 4L 6 4C 5.46957 4 4.96086 4.21071 4.58579 4.58579C 4.21071 4.96086 4 5.46957 4 6L 4 20C 4 20.5304 4.21071 21.0391 4.58579 21.4142C 4.96086 21.7893 5.46957 22 6 22L 17 22C 17.5304 22 18.0391 21.7893 18.4142 21.4142C 18.7893 21.0391 19 20.5304 19 20L 19 6C 19 5.46957 18.7893 4.96086 18.4142 4.58579C 18.0391 4.21071 17.5304 4 17 4ZM 14 0L 2 0C 1.46957 4.44089e-16 0.960859 0.210714 0.585786 0.585786C 0.210714 0.960859 8.88178e-16 1.46957 4.44089e-16 2L 4.44089e-16 16L 2 16L 2 2L 14 2L 14 0Z"/>
              </svg>
            </span>
            <a href={`/${props.compKey}`}
              onClick={onRedirect}
            >
              {window.location.host}/{props.compKey}
            </a>
          </span>

          <a
            href={`/${props.compKey}`}
            onClick={onRedirect}  
            className={classes.room_modal_button}
          >
            Go to Room
          </a>
        </div>
      </div>
    </div>
  );
};