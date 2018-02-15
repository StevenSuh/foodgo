// yelp credentials
const yelp = require('yelp-fusion');

const yelpApiKey = 'sm3FJtRnKTHAG3xDienADVcokgx-k17P7ipGQv3LVb6-csdVTQ4NKs1-hrp-jab7bFwVpgmLvDnt2zjOyh9krMEubPkISoDbfw3-GHXf19-9qFGKgo2tQ8xiKAeFWnYx';
const client = yelp.client(yelpApiKey);

const searchRequest = {
  term: 'Four Barrel Coffee',
  location: 'san francisco, ca'
};

// argument docs
// https://www.yelp.com/developers/documentation/v3/business_search

// main
module.exports = (app) => {
  app.get('/api/', async (request, result) => {
    // request.body
    const response = await client.search(request.body);

    const firstResult = response.jsonBody.businesses[0];
    const prettyJson = JSON.stringify(firstResult, null, 4);
    console.log(prettyJson);
  });
};
