import "dotenv/config";
import crypto from "crypto";
import express from 'express';

// import CyclicDb from "@cyclic.sh/dynamodb";
// const db = CyclicDb("fair-red-agouti-robeCyclicDB")
// const tokens = db.collection("users");

const app = express();

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";

app.get('/authorize', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	
    let code = req.query.code;
	let ip =  req.socket.remoteAddress || req.headers['x-forwarded-for'];

	console.log(`AUTH - ${ip}`);

	let url = MAL_ACCESSTOKEN_URL;
	let body = `client_id=${process.env.client_id}&client_secret=${process.env.client_secret}&grant_type=authorization_code&code_verifier=${CODE_VERIFIER}&code=${code}`;

	let response = await fetch(url, {headers: {'Content-Type': 'application/x-www-form-urlencoded;charset=UTF-8',},method: 'POST',body,});
	let json = await response.json();

	if (json.access_token !== null && json.access_token !== undefined) {
		let tokenJson = await tokens.get("tokenjson");
		if (tokenJson === null) {tokenJson = [];await tokens.set("tokenjson", {tokenlist: []});} else {tokenJson = tokenJson.props.tokenlist;}
		let sessionid = crypto.randomUUID();
		tokenJson.push({
			sessionid: sessionid,
			access: json.access_token,
			refresh: json.refresh_token
		});

		await tokens.set("tokenjson", {tokenlist: tokenJson});

		res.cookie("sessionid", sessionid, {httpOnly: true});

		return res.send({"succesfull": true});
	} else {
		return res.send({"succesfull": false});
	}
});

app.get('/gettokenlist', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');

	let tokenJson = await tokens.get("tokenjson");
	if (tokenJson === null) {tokenJson = [];await tokens.set("tokenjson", {tokenlist: []});} else {tokenJson = tokenJson.props.tokenlist;}

	res.send({tokens: tokenJson})
});

app.listen(8088, () =>
    console.log(`Anime API listening on port 8088!`),
);

module.exports = app;