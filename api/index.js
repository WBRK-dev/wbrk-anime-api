const app = require('express')();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
app.use(require('./assignTokensObj'));

let MAL_ACCESSTOKEN_URL = "https://myanimelist.net/v1/oauth2/token";
let CODE_VERIFIER = "this-is-bs-and-i-hate-this-part-so-just-make-something-really-massive";
global.MAL_ACCESSTOKEN_URL = MAL_ACCESSTOKEN_URL;
global.CODE_VERIFIER = CODE_VERIFIER;

const getAccessToken = require('./getAccessToken');
app.get('/api/grant/', (req, res) => res.redirect(`https://myanimelist.net/v1/oauth2/authorize?response_type=code&client_id=${process.env.client_id}&code_challenge=${CODE_VERIFIER}`))
app.get('/api/authorize', require("./auth/authorize"));
app.get('/api/list/get', getAccessToken, require("./list/get"));
app.get('/api/user/info', getAccessToken, require("./user/info"));




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

app.get('/api/test/gettokens', getAccessToken, (req, res) => {
	res.setHeader('Access-Control-Allow-Origin', '*');
	res.setHeader('Access-Control-Allow-Credentials', true);
	res.send({tokens_get: req.tokens.get(), tokensreq: req.accesstoken});
});

// app.listen(8088, () =>
//     console.log(`Anime API listening on port 8088!`),
// );

app.all((req, res) => res.writeHead(404).end('unknown'))
module.exports = app;