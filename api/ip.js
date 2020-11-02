module.exports = {
    run: async function (req, res) {
        return res.status(200).json({
            ip: req.header('cf-connecting-ip') || "idk"
        });
    }
}