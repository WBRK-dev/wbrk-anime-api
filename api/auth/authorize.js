const crypto = require("crypto");

module.exports = async (req, res) => {
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

		req.tokens.push({
			sessionid: sessionid,
			access: json.access_token,
			refresh: json.refresh_token
		});

		res.cookie("sessionid", sessionid, {httpOnly: true, secure: true, sameSite: "none", maxAge: 1000*60*60*24*30});
		
		return res.send({"succesfull": true});
	} else {
		return res.send({"succesfull": false, response: json});
	}
}