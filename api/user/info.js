module.exports = async (req, res) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://wbrk-anime.pages.dev');
	res.setHeader('Access-Control-Allow-Credentials', true);
	
	let response = await fetch("https://api.myanimelist.net/v2/users/@me?fields=anime_statistics", {
		headers: {
			"Authorization": `Bearer ${req.accesstoken}`
		}
	});
	
	res.send(await response.json());
}