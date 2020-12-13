module.exports = {
    run: async function (req, res) {
        return res.status(200).json({
            message: "This API is still it's bata stage, please report any bugs you may find.",
            version: "0.0.1",
            endpoints: {
                "/api/logo": "Get the bots logo or avatar in various sizes.",
                "/api/test": "Just a test"
            }
        });
    }
}