module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	let sessionid = req.cookies.sessionid;
	let accesstoken = "";

	for (let i = 0; i < global.tokens.length; i++) {if (global.tokens[i].sessionid === sessionid) {accesstoken = global.tokens[i].access;break;}}

	let response = await fetch("https://api.myanimelist.net/v2/users/@me/animelist?fields=list_status&limit=16", {
		headers: {
			"Authorization": `Bearer ${accesstoken}`
		}
	});


	res.send(await response.json());
}