// Load configuration from environment variables or config.json (fallback)
let config;
try {
  config = require('../config.json');
} catch (err) {
  config = {};
}

const BOT_SERVER = process.env.BOT_SERVER || config.botServer;

module.exports = {
  run: async function (req, res) {
    try {
      if (!BOT_SERVER) {
        return res.status(500).json({
          error: 'Bot server URL not configured'
        });
      }

      // Create abort controller for timeout
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10 second timeout

      const response = await fetch(BOT_SERVER, {
        method: 'GET',
        headers: {
          'Accept': 'application/json',
        },
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        throw new Error(`Bot server responded with status: ${response.status}`);
      }

      const json = await response.json();
      return res.status(200).json(json);
    } catch (error) {
      console.error('Error fetching bot status:', error);
      
      // Handle timeout and network errors
      if (error.name === 'AbortError' || error.name === 'TypeError') {
        return res.status(503).json({
          error: 'Bot server is currently unavailable',
          message: 'Unable to connect to the bot server. Please try again later.'
        });
      }

      return res.status(500).json({
        error: 'Failed to fetch bot status',
        message: error.message
      });
    }
  }
};