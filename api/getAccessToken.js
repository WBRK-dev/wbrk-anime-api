module.exports = (req, res, next) => {
  req.accesstoken = req.tokens.find(req.cookies.sessionid).accesstoken;
  next();
}