module.exports = async (req, res) => {
    res.send(req.tokens.get())
}