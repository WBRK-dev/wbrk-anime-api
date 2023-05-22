module.exports = async (req, res) => {
    req.tokens.push({test:true})
    res.send(req.tokens.get())
}