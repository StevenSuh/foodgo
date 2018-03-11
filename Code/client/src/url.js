export default (process.env.NODE_ENV === 'production') ? 
  'https://foodgo183.herokuapp.com/' : 
  'http://localhost:3000/';