const cookieController = {};

// sets a cookie with spotify authorization token
cookieController.setCookie = (req, res, next) => {
  res.cookie('token', res.locals.token);
  return next();
};

// checks if token cookie exists in browser
cookieController.checkCookie = (req, res, next) => {
  if (req.cookies.token) {
    return next();
  }
  // if not found, redirect to login
  console.log('no cookie');
  res.redirect('/');
};

module.exports = cookieController;
