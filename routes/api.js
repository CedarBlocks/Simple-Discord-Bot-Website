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

module.exports = router;