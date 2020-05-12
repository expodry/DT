const fetch = require('node-fetch');
const superagent = require('superagent');
// client_id and client_secret stored in server/secrets/secrets.js
const { client_id, client_secret } = require('../secrets/secrets.js');

// url that spotify will redirect to upon authentication
const redirect_uri = 'http://localhost:8080/authorize';

const userController = {};

// posts a request to spotify to get an authorization token
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
  // body contains the following parameters encoded in application/x-www-form-urlencoded:
    // client_id
    // cient_secret
    // grant_type: "authorization_code"
    // code: authorization code returned from initial request
    // redirect_uri: redirect_uri supplied when requesting code
  // header should specify content type as 'application/x-www-form-urlencoded'
  // on success, spotify's response body will contain the following properties:
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

// redirects to spotify page prompting user to login
userController.authenticate = (req, res, next) => {
  // //define access scopes
  const scopes = 'user-read-private user-read-email';
  // redirect url must contain client_id, scopes, redirect_uri
  //* can also contain an optional 'state' parameter */
  res.redirect(
    `${
      'https://accounts.spotify.com/authorize'
      + '?response_type=code'
      + '&client_id='
    }${client_id}${
      scopes ? `&scope=${encodeURIComponent(scopes)}` : ''
    }&redirect_uri=${encodeURIComponent(redirect_uri)}`,
  );
  // on spotify login page, user is asked to accept or deny terms of scope
  // if accepted, response query string contains authorization code
  // if denied, query string contains error
  // *query string will also contain value of 'state' if one was provided in params
};

// fetches user's profile information from spotify api
// requires spotify access token received in authorize middleware
userController.getUserData = (req, res, next) => {
  // request to spotify's api with access_token from token cookie in header
  fetch('https://api.spotify.com/v1/me', {
    method: 'get',
    headers: { Authorization: `Bearer ${req.cookies.token.access_token}` },
  })
    .then((resp) => resp.json())
    .then((data) => {
      // if spotify returned an error (i.e. token was invalid) redirect to login
      if (data.error) {
        console.log('invalid token');
        res.redirect('/');
      } else {
        // save display name and email from response object
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

// REFRESHING TOKENS:
// after tokens expire, new ones must be requested using the refresh_token property on token object
// POST https://accounts.spotify.com/api/token
// body must contain grant_type and refresh_token encoded in application/x-www-form-urlencoded
// header must contain following parameter:
// Authorization: Basic <base64 encoded client_id:client_secret>
  // * alternatively, the client id and secret could be sent in request body as in authorize

module.exports = userController;
