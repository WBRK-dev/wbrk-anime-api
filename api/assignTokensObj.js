module.exports = (req, res, next) => {
	req.tokens = require("./vars");
	next();
}