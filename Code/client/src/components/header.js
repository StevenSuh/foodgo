import React from 'react';
import { Link } from 'react-router-dom';

import classes from './header.css';

export default () => {
  return (
    <header className={classes.header}>
      <Link to="/" className={classes.header_link}>foodgo</Link>
    </header>
  );
}