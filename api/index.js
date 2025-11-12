module.exports = {
  run: async function (req, res) {
    return res.status(200).json({
      message: "This API is still in its beta stage, please report any bugs you may find.",
      version: "0.0.4",
      endpoints: {
        "/api/logo": "Get the bot's logo or avatar in various sizes.",
        "/api/status": "Returns the bot's status",
        "/api/stats": "Returns the bot's status (alias for /api/status)"
      }
    });
  }
};