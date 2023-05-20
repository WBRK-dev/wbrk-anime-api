const app = require('express')();

app.get('/authorize', (req, res) => {
	res.send({"yes": true})
});






module.exports = app;