const cookieController = {};

cookieController.setCookie = (req, res, next) => {
  res.cookie('token', res.locals.token);
  return next();
};

cookieController.checkCookie = (req, res, next) => {
  if (req.cookies.token) {
  return next();
} else {
  console.log('no cookie');
  res.redirect('/');
}
};

module.exports = cookieController;
