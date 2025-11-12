# Simple Discord Bot Website

<a href="https://discord.gg/2YQ2ydr">![Discord](https://img.shields.io/discord/692419586242641925.svg?logo=discord&colorB=7289DA)</a>

A simple Express.js website and API for Discord bots. This project has been updated with modern security practices and best practices.

## Features

- Modern Express.js server with security middleware
- Rate limiting to prevent abuse
- Security headers via Helmet
- Environment variable support
- RESTful API endpoints
- Error handling and logging

## Requirements

- Node.js >= 18.0.0
- npm or yarn

## Setup

1. Clone the repository:
```bash
git clone https://github.com/JLDENSMORE/Simple-Discord-Bot-Website.git
cd Simple-Discord-Bot-Website
```

2. Install dependencies:
```bash
npm install
```

3. Configure environment variables:
   - Copy `.env.example` to `.env`
   - Fill in your configuration values:
     ```env
     PORT=3000
     NODE_ENV=development
     SUPPORT_SERVER=https://discord.gg/your-server-invite
     BOT_INVITE=https://discord.com/oauth2/authorize?client_id=YOUR_BOT_ID&scope=bot&permissions=YOUR_PERMISSIONS
     BOT_SERVER=http://localhost:19172
     ```

   Alternatively, you can use `config.json` (not recommended for production).

4. Start the server:
```bash
npm start
```

## API Endpoints

- `GET /api` - API information and available endpoints
- `GET /api/logo` - Get bot logo/avatar in various sizes
- `GET /api/status` - Get bot status from bot server
- `GET /api/stats` - Alias for `/api/status`

## Security Features

- **Helmet.js**: Sets various HTTP headers for security
- **Rate Limiting**: Prevents abuse with request rate limiting
- **Environment Variables**: Secure configuration management
- **Error Handling**: Proper error handling without exposing sensitive information
- **Input Validation**: Basic validation and sanitization

## Recent Updates (v0.0.4)

- Updated all dependencies to latest versions
- Removed deprecated `body-parser` (using Express built-in)
- Removed `node-fetch` (using native fetch API)
- Added security middleware (Helmet, rate limiting)
- Improved error handling throughout
- Added environment variable support
- Fixed timeout handling in API routes
- Updated to Node.js 18+ requirement

## License

MIT

## Contributing

Feel free to make a pull request with any updates or changes you would like to see.
