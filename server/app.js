const express = require('express');
const cookieParser = require('cookie-parser');
const path = require('path');
const apiController = require('./controllers/apiController');
const userController = require('./controllers/userController');

const app = express();
const port = 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());

app.get('/verify', 
  userController.authenticate, 
  (req, res) => res.status(200).redirect('/authorize'));

app.get('/authorize',
  userController.authorize,
  (req, res) => res.redirect('/home'));


app.get('/home', 
  // userController.authorize,
  // userController.getUserData,
  (req, res) => res.status(200).sendFile(path.resolve(__dirname, '..', 'dist', 'index.html')));

app.get('/api/:city&:country',
  apiController.getCountryData,
  apiController.getWeatherData,
  (req, res) => res.status(200).send(res.locals.data));


app.use(
  '/',
  express.static('./dist', {
    index: 'index.html',
  }),
);

// catch-all route handler for any requests to an unknown route
app.all('*', (req, res) => {
  res.sendFile(path.resolve(__dirname, '..', 'dist', 'index.html'));
});

// global error handler
app.use((err, req, res, next) => {
  const defaultErr = {
    log: 'Express error handler caught unknown middleware error',
    status: 400,
    message: { err: 'An error occurred' },
  };
  const errObj = { ...defaultErr, ...err };
  res.status(errObj.status).send(errObj.message.err);
});

app.listen(port, () => console.log(`Example app listening on port ${port}!`));
