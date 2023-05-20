const app = require('express')();

app.get('/api/authorize', (req, res) => {
	res.send({"yes": true})
});






module.exports = app;