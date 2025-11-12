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
- `GET /api/status` - Get bot status, server count, ping, and online/offline status
- `GET /api/stats` - Alias for `/api/status`
- `POST /api/update-stats` - Update bot stats (server count, ping)

## API Usage Guide

### Overview

The API allows your Discord bot to report its statistics (server count, ping, status) to the website, which will then be displayed on the homepage. The website automatically fetches stats from your bot server, but you can also manually update them via POST requests.

### Getting Bot Status

**Endpoint:** `GET /api/status` or `GET /api/stats`

**Response:**
```json
{
  "status": "online",
  "serverCount": 1234,
  "ping": 45,
  "lastUpdate": "2024-01-15T10:30:00.000Z"
}
```

**Example (cURL):**
```bash
curl https://yourwebsite.com/api/status
```

**Example (JavaScript/Node.js):**
```javascript
const response = await fetch('https://yourwebsite.com/api/status');
const data = await response.json();
console.log(`Bot is ${data.status}, serving ${data.serverCount} servers`);
```

**Example (Python):**
```python
import requests

response = requests.get('https://yourwebsite.com/api/status')
data = response.json()
print(f"Bot is {data['status']}, serving {data['serverCount']} servers")
```

### Updating Bot Stats

**Endpoint:** `POST /api/update-stats`

**Request Body:**
```json
{
  "serverCount": 1234,
  "ping": 45
}
```

Both fields are optional - you can send just `serverCount`, just `ping`, or both.

**Response:**
```json
{
  "success": true,
  "message": "Stats updated successfully",
  "serverCount": 1234,
  "ping": 45
}
```

#### Example 1: Update Server Count Only

**cURL:**
```bash
curl -X POST https://yourwebsite.com/api/update-stats \
  -H "Content-Type: application/json" \
  -d '{"serverCount": 1234}'
```

**JavaScript/Node.js (Discord.js):**
```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const serverCount = client.guilds.cache.size;
  
  // Update server count on website
  try {
    const response = await fetch('https://yourwebsite.com/api/update-stats', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ serverCount: serverCount })
    });
    
    const data = await response.json();
    console.log(`Updated website: ${data.message}`);
  } catch (error) {
    console.error('Failed to update website stats:', error);
  }
});

// Update every 5 minutes
setInterval(async () => {
  const serverCount = client.guilds.cache.size;
  await fetch('https://yourwebsite.com/api/update-stats', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ serverCount: serverCount })
  });
}, 5 * 60 * 1000);

client.login('YOUR_BOT_TOKEN');
```

**Python (discord.py):**
```python
import discord
import aiohttp
import asyncio

client = discord.Client(intents=discord.Intents.default())

async def update_stats():
    server_count = len(client.guilds)
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            'https://yourwebsite.com/api/update-stats',
            json={'serverCount': server_count}
        ) as response:
            data = await response.json()
            print(f"Updated website: {data['message']}")

@client.event
async def on_ready():
    print(f'Bot is ready! Serving {len(client.guilds)} servers')
    await update_stats()
    
    # Update every 5 minutes
    while True:
        await asyncio.sleep(5 * 60)  # 5 minutes
        await update_stats()

client.run('YOUR_BOT_TOKEN')
```

#### Example 2: Update Server Count and Ping

**JavaScript/Node.js (Discord.js):**
```javascript
const { Client, GatewayIntentBits } = require('discord.js');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });

client.once('ready', async () => {
  const updateStats = async () => {
    const serverCount = client.guilds.cache.size;
    const ping = client.ws.ping; // WebSocket ping in milliseconds
    
    try {
      const response = await fetch('https://yourwebsite.com/api/update-stats', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          serverCount: serverCount,
          ping: ping
        })
      });
      
      const data = await response.json();
      console.log(`Updated: ${data.serverCount} servers, ${data.ping}ms ping`);
    } catch (error) {
      console.error('Failed to update stats:', error);
    }
  };
  
  // Update immediately
  await updateStats();
  
  // Update every 5 minutes
  setInterval(updateStats, 5 * 60 * 1000);
});

client.login('YOUR_BOT_TOKEN');
```

**Python (discord.py):**
```python
import discord
import aiohttp
import asyncio

client = discord.Client(intents=discord.Intents.default())

async def update_stats():
    server_count = len(client.guilds)
    ping = round(client.latency * 1000)  # Convert to milliseconds
    
    async with aiohttp.ClientSession() as session:
        async with session.post(
            'https://yourwebsite.com/api/update-stats',
            json={
                'serverCount': server_count,
                'ping': ping
            }
        ) as response:
            data = await response.json()
            print(f"Updated: {data['serverCount']} servers, {data['ping']}ms ping")

@client.event
async def on_ready():
    print(f'Bot is ready! Serving {len(client.guilds)} servers')
    await update_stats()
    
    # Update every 5 minutes
    while True:
        await asyncio.sleep(5 * 60)  # 5 minutes
        await update_stats()

client.run('YOUR_BOT_TOKEN')
```

#### Example 3: Update Only Ping

**cURL:**
```bash
curl -X POST https://yourwebsite.com/api/update-stats \
  -H "Content-Type: application/json" \
  -d '{"ping": 45}'
```

**JavaScript:**
```javascript
const ping = 45; // Your bot's ping in milliseconds

await fetch('https://yourwebsite.com/api/update-stats', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ ping: ping })
});
```

### Error Handling

**400 Bad Request:**
```json
{
  "error": "Invalid server count",
  "message": "serverCount must be a non-negative number"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error",
  "message": "An error occurred while updating stats"
}
```

### Best Practices

1. **Update Frequency**: Update stats every 5-10 minutes to avoid unnecessary load. The website automatically refreshes every 10 minutes.

2. **Error Handling**: Always wrap API calls in try-catch blocks and handle errors gracefully.

3. **Partial Updates**: You can update just `serverCount` or just `ping` - the API will preserve the other value.

4. **Automatic Status**: The website automatically determines online/offline status based on whether it can reach your bot server. You don't need to send status manually.

5. **Caching**: If your bot server is temporarily unavailable, the website will show cached data until it can reconnect.

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
