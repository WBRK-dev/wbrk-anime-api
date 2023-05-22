const tokens = require("../vars");

module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	let sessionid = req.cookies.sessionid;
	let accesstoken = "";

	let tempTokens = tokens.get();

	for (let i = 0; i < tempTokens.length; i++) {if (tempTokens[i].sessionid === sessionid) {accesstoken = tempTokens[i].access;break;}}

	let response = await fetch("https://api.myanimelist.net/v2/users/@me?fields=anime_statistics", {
		headers: {
			"Authorization": `Bearer ${accesstoken}`
		}
	});

	res.send(await response.json());
}