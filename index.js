import "dotenv/config";
import "http";

import express from 'express';

const app = express();

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";

app.get('/accesstoken/authorize', async (req, res) => {
    let code = req.query.code;

	console.log(`AUTH - ${code}`);

	let url = MAL_ACCESSTOKEN_URL;

	let body = `client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=authorization_code&code_verifier=${CODE_VERIFIER}&code=${code}`;

	let response = await fetch(url, {
		headers: {
		  'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',
		},
		method: 'POST',
		body,
	});

	let json = await response.json();

    return res.send({"status": 200});
});

app.get('/json/write', async (req, res) => {
    let user = req.query.code;
    let passw = req.query.code;

	

    return res.send({"status": 200});
});

app.listen(8088, () =>
    console.log(`Anime API listening on port 8088!`),
);