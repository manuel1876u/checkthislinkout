import express from 'express';
import cors from 'cors';
import fetch from 'node-fetch';

const app = express();
const PORT = 5000;

//CONFIGURATION 
const TELEGRAM_BOT_TOKEN = '8391523419:AAG4jF0Bgr7aD5c-nMKz_VGQkn1PZ5NJEwo';
const TELEGRAM_CHAT_ID = '8254123587';

// Middleware
app.use(cors());
app.use(express.json());

// Helper function to send Telegram message
async function sendTelegramMessage(message) {
  const url = `https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`;
  
  try {
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        chat_id: TELEGRAM_CHAT_ID,
        text: message,
        parse_mode: 'HTML'
      })
    });

    const data = await response.json();
    
    if (!data.ok) {
      throw new Error(`Telegram API error: ${data.description}`);
    }
    
    return data;
  } catch (error) {
    console.error('Failed to send Telegram message:', error);
    throw error;
  }
}

// Format the notification message
function formatNotificationMessage(data) {
  const { ip, location, timestamp, userAgent } = data;
  
  const date = new Date(timestamp);
  const formattedDate = date.toLocaleString('en-US', {
    dateStyle: 'full',
    timeStyle: 'long'
  });
 
  const locationStatus = '✅ Tracked';

  return `
🚨 <b>NEW VISITOR ALERT</b> 🚨

📍 <b>IP Address:</b> <code>${ip}</code>

🌍 <b>Location Details:</b> ${locationStatus} 
   • Country: ${location.country}

🕐 <b>Timestamp:</b> ${formattedDate}

💻 <b>Device Info:</b>
<code>${userAgent}</code>

⚡ <i>Link accessed successfully</i>
  `.trim();
}


// Main notification endpoint
app.post('/api/notify', async (req, res) => {
  try {
    const { ip, location, timestamp, userAgent } = req.body;

    // Validate required fields
    if (!ip) {
      return res.status(400).json({ 
        success: false, 
        error: 'IP address is required' 
      });
    }

    // Validate location object structure
    if (!location || typeof location !== 'object') {
      return res.status(400).json({ 
        success: false, 
        error: 'Location data is required' 
      });
    }

    // Log the access with more details
    console.log(`
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
📊 NEW ACCESS DETECTED
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
🌐 IP: ${ip}
📍 Location: ${location.city}, ${location.region}, ${location.country}
🕐 Time: ${new Date(timestamp).toLocaleString()}
💻 Device: ${userAgent.substring(0, 50)}...
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━
    `);

    // Format and send Telegram message
    const message = formatNotificationMessage(req.body);
    await sendTelegramMessage(message);

    console.log('✅ Telegram notification sent successfully!');  

  res.sendStatus(200);

  } catch (error) {
    console.error('❌ Error processing notification:', error);
    res.sendStatus(500);
  }
});



// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'online',
    timestamp: new Date().toISOString(),
    service: 'Telegram Notification Server',
    configured: !TELEGRAM_BOT_TOKEN.includes('YOUR_BOT')
  });
});

// Test endpoint to verify Telegram connection
app.get('/api/test-telegram', async (req, res) => {
  try {
    await sendTelegramMessage('✅ Test message: Server is connected and working!');
    res.json({ 
      success: true, 
      message: 'Test message sent to Telegram successfully!' 
    });
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      error: 'Failed to send test message',
      details: error.message,
      hint: 'Check your TELEGRAM_BOT_TOKEN and TELEGRAM_CHAT_ID'
    });
  }
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({ 
    success: false, 
    error: 'Endpoint not found',
    availableEndpoints: [
      'POST /api/notify',
      'GET /api/health',
      'GET /api/test-telegram'
    ]
  });
});

// Start server
app.listen(PORT, () => {
  console.log(`
╔═══════════════════════════════════════════════════╗
║  🚀 Server is running on http://localhost:${PORT}  ║
║  📡 Telegram notification service active          ║
╚═══════════════════════════════════════════════════╝

⚙️  Configuration Status:
   Bot Token: ${TELEGRAM_BOT_TOKEN.includes('YOUR_BOT') ? '❌ NOT SET' : '✅ SET'}
   Chat ID: ${TELEGRAM_CHAT_ID.includes('YOUR_CHAT') ? '❌ NOT SET' : '✅ SET'}

📚 Available Endpoints:
   POST /api/notify        - Send visitor notification
   GET  /api/health        - Health check
   GET  /api/test-telegram - Test Telegram connection

${TELEGRAM_BOT_TOKEN.includes('YOUR_BOT') ? '\n⚠️  WARNING: Please configure your Telegram credentials!\n' : '✅ Ready to receive notifications!\n'}
🎯 Waiting for visitors...
  `);
});