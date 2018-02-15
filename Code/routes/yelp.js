// yelp credentials
const yelp = require('yelp-fusion');

const yelpApiKey = 'sm3FJtRnKTHAG3xDienADVcokgx-k17P7ipGQv3LVb6-csdVTQ4NKs1-hrp-jab7bFwVpgmLvDnt2zjOyh9krMEubPkISoDbfw3-GHXf19-9qFGKgo2tQ8xiKAeFWnYx';
const client = yelp.client(yelpApiKey);

const searchRequest = {
  term: 'Four Barrel Coffee',
  location: 'san francisco, ca'
};

// main
module.exports = (app) => {
  app.get('/api/', async (request, result) => {
    const response = await client.search(searchRequest);

    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
  });
};
