const cookieController = {};

cookieController.setCookie = (req, res, next) => {
  res.cookie('token', res.locals.token);
  return next();
};


module.exports = cookieController;
