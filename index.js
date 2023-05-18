import "dotenv/config";
import { readFileSync, writeFileSync} from "fs";;

import express from 'express';

const app = express();

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";

app.get('/accesstoken/authorize', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	
    let code = req.query.code;

	console.log(`AUTH`);

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

	if (json.access_token !== null && json.access_token !== undefined) {
		let userid = crypto.randomUUID();
		let users = JSON.parse(readFileSync("database.json"));

		users.push({id: userid, access_token: json.access_token, refresh_token: json.refresh_token});

		writeFileSync("database.json", JSON.stringify(users));

		return res.send({"succesfull": true, "userid": userid});
	} else {
		return res.send({"succesfull": false});
	}
});

app.get('/json/write', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	
    let user = req.query.user;
    let passw = req.query.pass;

	let users = JSON.parse(readFileSync("database.json"));

	users.push({
		name: user,
		passw: passw
	})
	

    return res.send({"status": 200, "users": users});
});

app.get('/getdatabase', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let users = JSON.parse(readFileSync("database.json"));

    return res.send({"status": 200, "users": users});
});

app.listen(8088, () =>
    console.log(`Anime API listening on port 8088!`),
);