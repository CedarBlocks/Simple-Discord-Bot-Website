// Load configuration from environment variables or config.json (fallback)
let config;
try {
  config = require('../config.json');
} catch (err) {
  config = {};
}

const BOT_SERVER = process.env.BOT_SERVER || config.botServer;

// In-memory cache for bot stats (updated by bot POST requests)
let botStatsCache = {
  serverCount: 0,
  status: 'offline',
  ping: null,
  lastUpdate: null
};

module.exports = {
  run: async function (req, res) {
    try {
      if (!BOT_SERVER) {
        return res.status(500).json({
          error: 'Bot server URL not configured',
          status: 'offline',
          serverCount: 0
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
      
      // Extract server count from various possible field names
      // Use nullish coalescing (??) to preserve 0 values, only fallback for null/undefined
      const serverCount = json.serverCount ?? json.guilds ?? json.servers ?? json.guildCount ?? botStatsCache.serverCount ?? 0;
      
      // Extract ping from various possible field names
      // Use nullish coalescing (??) to preserve 0 values, only fallback for null/undefined
      const ping = json.ping ?? json.latency ?? botStatsCache.ping ?? null;
      
      // Update cache with fresh data
      botStatsCache = {
        serverCount: serverCount,
        status: 'online',
        ping: ping,
        lastUpdate: new Date().toISOString()
      };

      return res.status(200).json({
        ...json,
        status: 'online',
        serverCount: serverCount,
        ping: ping
      });
    } catch (error) {
      console.error('Error fetching bot status:', error);
      
      // Return cached data if available, otherwise return offline status
      const isOffline = error.name === 'AbortError' || error.name === 'TypeError';
      
      if (isOffline && botStatsCache.lastUpdate) {
        // Return cached data but mark as potentially stale
        return res.status(200).json({
          status: 'offline',
          serverCount: botStatsCache.serverCount,
          ping: botStatsCache.ping,
          cached: true,
          lastUpdate: botStatsCache.lastUpdate,
          message: 'Bot server is currently unavailable, showing cached data'
        });
      }

      return res.status(503).json({
        error: 'Bot server is currently unavailable',
        status: 'offline',
        serverCount: botStatsCache.serverCount || 0,
        ping: botStatsCache.ping,
        message: 'Unable to connect to the bot server. Please try again later.'
      });
    }
  },
  
  // Method to update stats from bot POST requests
  updateStats: function(serverCount, ping) {
    botStatsCache = {
      // Use nullish coalescing (??) to preserve 0 values - only use default if undefined/null
      serverCount: serverCount ?? botStatsCache.serverCount ?? 0,
      status: 'online',
      // Use nullish coalescing (??) to preserve 0 values - only use cached if undefined/null
      ping: ping ?? botStatsCache.ping,
      lastUpdate: new Date().toISOString()
    };
  },
  
  // Method to get cached stats
  getCachedStats: function() {
    return botStatsCache;
  }
};