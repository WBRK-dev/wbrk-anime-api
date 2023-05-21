const app = require('express')();
const crypto = require("crypto");

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";
let tokens = [];

app.get('/api/authorize', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	
    let code = req.query.code;
	let ip =  req.headers['x-forwarded-for'] || req.socket.remoteAddress;

	console.log(`AUTH - ${ip}`);

	let url = MAL_ACCESSTOKEN_URL;
	let body = `client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=authorization_code&code_verifier=${CODE_VERIFIER}&code=${code}`;

	let response = await fetch(url, {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',},method: 'POST',body,});
	let json = await response.json();

	if (json.access_token !== null && json.access_token !== undefined) {
		let sessionid = crypto.randomUUID();

		tokens.push({
			sessionid: sessionid,
			access: json.access_token,
			refresh: json.refresh_token
		});

		res.cookie("sessionid", sessionid, {httpOnly: true, secure: true, sameSite: "none"});

		return res.send({"succesfull": true});
	} else {
		return res.send({"succesfull": false, failedFetch: json});
	}
});

function refreshToken() {

}

app.get('/api/list/get', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	let sessionid = req.cookies.sessionid;
	let accesstoken = "";

	for (let i = 0; i < tokens.length; i++) {if (tokens[i].sessionid === sessionid) {accesstoken = tokens[i].access;break;}}

	let response = await fetch("", {
		headers: {
			"Authorization": `Bearer ${accesstoken}`
		}
	});


	res.send(await response.json());
});











app.get('/api/gettokens', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.send(tokens);
});

// app.listen(8088, () =>
//     console.log(`Anime API listening on port 8088!`),
// );

module.exports = app;