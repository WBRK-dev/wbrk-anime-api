const app = require('express')();
const crypto = require("crypto");
const cookieParser = require("cookie-parser");
const tokens = require("./vars");

app.use(cookieParser());

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";

// Authorize
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
		return res.send({"succesfull": false, response: json});
	}
});

// User anime list
app.get('/api/list/get', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	let sessionid = req.cookies.sessionid;
	let accesstoken = "";
	let tempTokens = tokens.get();

	for (let i = 0; i < tempTokens.length; i++) {if (tempTokens[i].sessionid === sessionid) {accesstoken = tempTokens[i].access;break;}}

	let response = await fetch("https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=16&sort=list_updated_at&status=watching", {
		headers: {
			"Authorization": `Bearer ${accesstoken}`
		}
	});


	res.send(await response.json());
});

// User
app.get('/api/user/info', async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	let accesstoken = tokens.find(req.cookies.sessionid);
	console.log(accesstoken);
	let response = await fetch("https://api.myanimelist.net/v2/users/@me?fields=anime_statistics", {
		headers: {
			"Authorization": `Bearer ${accesstoken}`
		}
	});
	
	res.send({res: await response.json()});
});




// Debug tests
app.get('/api/test/list/get', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	let access = "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiIsImp0aSI6ImUwZmMxYTY5Y2ZlNjkwNTBiYTVmZWQ3YmFhNTIyNzMzZTdmYmE3OGQ0ZjczYjg3YWQxOGJjNzY3MzViYjZhOTcwNGIyZjcyMTVjN2NkNWZmIn0.eyJhdWQiOiJmYjU2MTNkZjBmMzk1MjRhMjk1YjBkMWQ3YTYyMTNjYSIsImp0aSI6ImUwZmMxYTY5Y2ZlNjkwNTBiYTVmZWQ3YmFhNTIyNzMzZTdmYmE3OGQ0ZjczYjg3YWQxOGJjNzY3MzViYjZhOTcwNGIyZjcyMTVjN2NkNWZmIiwiaWF0IjoxNjg0Njc4NTIxLCJuYmYiOjE2ODQ2Nzg1MjEsImV4cCI6MTY4NzM1NjkyMSwic3ViIjoiMTQ1ODM3NzgiLCJzY29wZXMiOltdfQ.jJWkn4nosdx1KaRG4zV3UrqZaiyRhW5BUfXVT-_KV4CBjDwdc6A4G7TKr-ZdZTtUC8XDriR7U81P1yrLwxSQmmQyTWNBUyNIXBtq_p-bBy7Q5rrQ5vWABBw7Tmkb0tsPvR0NVuO2V_blNvjD7I00_EVccptgh80fzW9K5wc_MTdp52PSS6fnOd_LucEIY1LQvI4FTl7Tdb-CUQirn8mDS15jBC-1FxM3fYBJYv8K_qYxY03fkQ-xWrsALWv6taBRuI1gmoJQJvIa2WVnDxDlxmFSObVUho9pyPxuP5p4HgJCY1em2qHH50n0T79ZNGbytgaaRAs2QJb_ok0HRd4PUQ";

	let response = await fetch("https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=16&sort=list_updated_at&status=watching", {
		headers: {
			"Authorization": `Bearer ${access}`
		}
	});

	res.send(await response.json());
})

app.get('/api/test', async (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.send({success: true});
})

app.get('/api/test/gettokens', (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.send({tokens_get: tokens.get(), accesstoken: tokens.find(req.cookies.sessionid)});
});
// END - Debug tests

// app.listen(8088, () =>
//     console.log(`Anime API listening on port 8088!`),
// );

module.exports = app;