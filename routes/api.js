const express = require('express');
const router = express.Router();

// Request logging middleware
router.use((req, res, next) => {
  console.log(`${req.method} ${req.url} @ ${new Date().toISOString()}`);
  next();
});

// API routes with error handling
router.get('/', async (req, res) => {
  try {
    await require('../api/index.js').run(req, res);
  } catch (error) {
    console.error('Error in API index route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    });
  }
});

router.get('/logo', async (req, res) => {
  try {
    await require('../api/logo.js').run(req, res);
  } catch (error) {
    console.error('Error in API logo route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    });
  }
});

router.get('/status', async (req, res) => {
  try {
    await require('../api/status.js').run(req, res);
  } catch (error) {
    console.error('Error in API status route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    });
  }
});

router.get('/stats', async (req, res) => {
  try {
    await require('../api/status.js').run(req, res);
  } catch (error) {
    console.error('Error in API stats route:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while processing your request'
    });
  }
});

// POST endpoint for bot to update server count, status, and ping
router.post('/update-stats', async (req, res) => {
  try {
    const { serverCount, ping } = req.body;
    
    if (serverCount !== undefined && (typeof serverCount !== 'number' || serverCount < 0)) {
      return res.status(400).json({
        error: 'Invalid server count',
        message: 'serverCount must be a non-negative number'
      });
    }

    if (ping !== undefined && (typeof ping !== 'number' || ping < 0)) {
      return res.status(400).json({
        error: 'Invalid ping',
        message: 'ping must be a non-negative number (in milliseconds)'
      });
    }

    const statusModule = require('../api/status.js');
    statusModule.updateStats(serverCount, ping);
    
    return res.status(200).json({
      success: true,
      message: 'Stats updated successfully',
      serverCount: serverCount !== undefined ? serverCount : statusModule.getCachedStats().serverCount,
      ping: ping !== undefined ? ping : statusModule.getCachedStats().ping
    });
  } catch (error) {
    console.error('Error updating stats:', error);
    res.status(500).json({
      error: 'Internal server error',
      message: 'An error occurred while updating stats'
    });
  }
});

module.exports = router;