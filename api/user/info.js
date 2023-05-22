module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	let accesstoken = req.tokens.find(req.cookies.sessionid)
	let response = await fetch("https://api.myanimelist.net/v2/users/@me?fields=anime_statistics", {
		headers: {
			"Authorization": `Bearer ${accesstoken}`
		}
	});
	
	res.send({res: await response.json()});
}