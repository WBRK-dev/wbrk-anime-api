const app = require('express')();
const cookieParser = require("cookie-parser");
require('dotenv').config()
// const AWS = require("aws-sdk"); const s3 = new AWS.S3();

app.use(cookieParser());
app.use(require('./assignTokensObj'));
// app.use((req, res, next) => {req.s3 = s3; next();});

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";
global.MAL_ACCESSTOKEN_URL = MAL_ACCESSTOKEN_URL;
global.CODE_VERIFIER = CODE_VERIFIER;

const getAccessToken = require('./getAccessToken');
app.get('/grant/', (req, res) => res.redirect(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${process.env.client_id}&code_challenge=${CODE_VERIFIER}`))
app.get('/authorize', require("./auth/authorize"));
app.get('/list/get', getAccessToken, require("./list/get"));
app.get('/user/info', getAccessToken, require("./user/info"));



// Debug tests
app.get('/test', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://development.wbrk-anime.pages.dev');
	res.send({success: true});
})

app.get('/test/gettokens', getAccessToken, async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	if (req.query.admin === process.env.admin_token) {
		// let my_file = await s3.getObject({
		// 	Bucket: "cyclic-fair-red-agouti-robe-eu-central-1",
		// 	Key: "tokens.json",
		// }).promise()



		res.send({tokens_get: req.tokens.get(), yourtokens: req.tokens.find(req.cookies.sessionid)});
	} else {
		res.send("You are not permitted to access the tokens.");
	}
});
// END - Debug tests

app.listen(8088, () =>
    console.log(`Anime API listening on port 8088!`),
);

app.all((req, res) => res.writeHead(404).end('unknown'))
module.exports = app;