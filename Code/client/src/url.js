export default (process.env.NODE_ENV === 'production') ? 
  'https://calm-springs-95813.herokuapp.com/' : 
  'http://localhost:3000/';