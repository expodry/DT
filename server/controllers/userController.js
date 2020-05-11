const fetch = require('node-fetch');
const superagent = require('superagent');
// eslint-disable-next-line camelcase
const { client_id, client_secret } = require('../secrets/secrets.js');

const redirect_uri = 'http://localhost:8080/authorize';
// const redirect_uri = 'http://localhost:3000/home';

const userController = {};

userController.authorize = (req, res, next) => {
  const reqbody = {
    client_id,
    client_secret,
    grant_type: 'authorization_code',
    code: req.query.code,
    redirect_uri,
  };
  // AFTER AUTH CODE HAS BEEN RECEIVED:
  // make a post request to https://accounts.spotify.com/api/token
  // body must contain following parameters encoded in application/x-www-form-urlencoded:
  // grant_type: "authorization_code"
  // code: authorization code returned from initial request
  // redirect_uri: redirect_uri supplied when requesting code
  // header must contain parameter:
  // Authorization: Basic *<base64 encoded client_id:client_secret>*
  //* *alternatively you can send client id and secret as request parameters in the post body
  // on success, spotify will send in request body:
  // access_token, token_type, scope, expires_in, refresh_token

  superagent
    .post('https://accounts.spotify.com/api/token')
    .send(reqbody)
    .set('Content-Type', 'application/x-www-form-urlencoded')
    .end((err, resp) => {
      if (err) {
        console.log(err);
        return next({ err: 'ERROR WITH AUTHORIZATION' });
      }
      res.locals.token = resp.body;
      return next();
    });
};

userController.authenticate = (req, res, next) => {
  // //define scopes
  const scopes = 'user-read-private user-read-email';
  // redirect to spotify page presenting scope
  res.redirect(
    `${
      'https://accounts.spotify.com/authorize' +
      '?response_type=code' +
      '&client_id='
    }${client_id}${
      scopes ? `&scope=${encodeURIComponent(scopes)}` : ''
    }&redirect_uri=${encodeURIComponent(redirect_uri)}`,
  );
  //* *add state */
  // need client id, scopes, redirect uri, (preferrably) state
  // user is asked to accept or deny and then is sent back to redirect uri
  // if accepted, response query string contains authorization code and value of state
  // if denied, query string contains error and value of state
};

userController.getUserData = (req, res, next) => {
  // AFTER ACCESS TOKEN HAS BEEN RECEIVED:
  // make requests to spotify web api with access token
  // receive datas
  fetch('https://api.spotify.com/v1/me', {
    method: 'get',
    headers: { Authorization: `Bearer ${req.cookies.token.access_token}` },
  })
    .then((resp) => {
      return resp.json();
    })
    .then((data) => {
      console.log(data);
      if (data.error) {
        console.log('invalid token');
        res.redirect('/');
      } else {
        res.locals.user = {
          display_name: data.display_name,
          email: data.email,
        };
        return next();
      }
    })
    .catch((err) => {
      console.log(err);
      return next({ err: 'ERROR WITH GETTING USER DATA' });
    });
};

// after tokens expire, new ones must be requested in exchage for refresh_token
// POST https://accounts.spotify.com/api/token
// body must contain grant_type and refresh_token encoded in application/x-www-form-urlencoded
// header must contain following parameter: Authorization: Basic <base64 encoded client_id:client_secret>

//after tokens expire, new ones must be requested in exchage for refresh_token
//POST https://accounts.spotify.com/api/token
//body must contain grant_type and refresh_token encoded in application/x-www-form-urlencoded
//header must contain following parameter: Authorization: Basic <base64 encoded client_id:client_secret>

module.exports = userController;
