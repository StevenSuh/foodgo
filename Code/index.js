const express = require('express');
const bodyParser = require('body-parser');

const app = express();

// npm body-parser
app.use(bodyParser.json());

// connect route
require('./routes/yelp')(app);

// to serve react frontend onto express
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('client/build'));

  const path = require('path');
  app.get('*', (request, result) => {
    result.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}

const PORT = process.env.PORT || 5000;
app.listen(PORT);