const path = require('path');
const morgan = require('morgan');
const express = require('express');
const helmet = require('helmet');
const rateLimit = require('express-rate-limit');

// Load configuration from environment variables or config.json (fallback)
let config;
try {
  config = require('./config.json');
} catch (err) {
  config = {};
}

// Use environment variables if available, otherwise fall back to config.json
const PORT = process.env.PORT || config.port || 3000;
const SUPPORT_SERVER = process.env.SUPPORT_SERVER || config.supportServer;
const BOT_INVITE = process.env.BOT_INVITE || config.botInvite;
const BOT_SERVER = process.env.BOT_SERVER || config.botServer;
const NODE_ENV = process.env.NODE_ENV || 'development';

const app = express();

// Security middleware
app.use(helmet({
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      styleSrc: ["'self'", "'unsafe-inline'", "https://cdn.jsdelivr.net", "https://cdnjs.cloudflare.com", "https://fonts.googleapis.com"],
      scriptSrc: ["'self'", "'unsafe-inline'", "https://code.jquery.com", "https://cdn.jsdelivr.net"],
      fontSrc: ["'self'", "https://fonts.gstatic.com"],
      imgSrc: ["'self'", "https:", "data:"],
      connectSrc: ["'self'"]
    }
  }
}));

// Rate limiting
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // Limit each IP to 100 requests per windowMs
  message: 'Too many requests from this IP, please try again later.',
  standardHeaders: true,
  legacyHeaders: false,
});

app.use(limiter);

// Logging middleware (only one instance)
if (NODE_ENV === 'production') {
  app.use(morgan('combined'));
} else {
  app.use(morgan('dev'));
}

// Body parsing middleware (built into Express, no need for body-parser)
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public')));

// API routes
const apiRoute = require('./routes/api');
app.use('/api', apiRoute);

// Routes
app.get('/', (req, res) => {
  res.render('index.ejs');
});

app.get('/commands', (req, res) => {
  res.render('commands.ejs');
});

app.get('/livechat', (req, res) => {
  res.render('livechat.ejs');
});

app.get('/privacy', (req, res) => {
  res.render('privacy.ejs');
});

app.get('/support', (req, res) => {
  if (!SUPPORT_SERVER) {
    return res.status(500).send('Support server URL not configured');
  }
  res.redirect(SUPPORT_SERVER);
});

app.get('/invite', (req, res) => {
  if (!BOT_INVITE) {
    return res.status(500).send('Bot invite URL not configured');
  }
  res.redirect(BOT_INVITE);
});

// 404 handler
app.get('*', (req, res) => {
  res.status(404).render('404.ejs');
});

// Error handling middleware
app.use((err, req, res, next) => {
  console.error('ERROR:', err.stack);
  
  // Don't expose stack traces in production
  const errorDetails = NODE_ENV === 'production' 
    ? { message: 'An error occurred' }
    : { message: err.message, stack: err.stack };
  
  res.status(err.status || 500).render('500.ejs', {
    error: errorDetails
  });
});

// Start server
const listener = app.listen(PORT, () => {
  console.log(`Server is listening on port ${listener.address().port}`);
  console.log(`Environment: ${NODE_ENV}`);
});