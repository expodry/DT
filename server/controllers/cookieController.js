const cookieController = {};

cookieController.setCookie = (req, res, next) => {
  console.log('token from request', res.locals.token);
  res.cookie('token', res.locals.token);
  // console.log('token when setting cookie', res.locals.token.access_token);
  return next();
};

module.exports = cookieController;
