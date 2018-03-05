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
  app.get('/api/search/', async (request, result) => {
    // request.body
    const data = {
      term: request.query.categories,
      latitude: parseFloat(request.query.lat),
      longitude: parseFloat(request.query.lng),
      price: request.query.price,
      radius: milesToMeters(request.query.radius || 15),
      limit: 10,
      offset: request.query.offset || 0
    };
    const yelpResponse = await client.search(data);

    const searchResult = yelpResponse.jsonBody.businesses;
    result.send(searchResult);
  });
};


// 1 mile = 1609.34 meters
// needs to return int
function milesToMeters(radius) {
  let value = parseInt(radius);
  value = Math.round(value*1609.34);

  return Math.min(value, 40000);
}
