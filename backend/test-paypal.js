const https = require('https');
const http = require('http');
const { URL } = require('url');
require('dotenv').config();

async function makeRequest(url, options) {
  return new Promise((resolve, reject) => {
    const urlObj = new URL(url);
    const protocol = urlObj.protocol === 'https:' ? https : http;
    
    const req = protocol.request({
      hostname: urlObj.hostname,
      port: urlObj.port,
      path: urlObj.pathname,
      method: options.method,
      headers: options.headers
    }, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => {
        resolve({
          ok: res.statusCode >= 200 && res.statusCode < 300,
          status: res.statusCode,
          json: () => Promise.resolve(JSON.parse(data))
        });
      });
    });
    
    req.on('error', reject);
    if (options.body) req.write(options.body);
    req.end();
  });
}

async function testPayPalConnection() {
  try {
    console.log('🔧 Testing PayPal Configuration...');
    console.log('Client ID:', process.env.PAYPAL_CLIENT_ID ? '✅ Set' : '❌ Missing');
    console.log('Client Secret:', process.env.PAYPAL_CLIENT_SECRET ? '✅ Set' : '❌ Missing');
    console.log('Base URL:', process.env.PAYPAL_BASE_URL);

    // Test getting access token
    const response = await makeRequest(`${process.env.PAYPAL_BASE_URL}/v1/oauth2/token`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
        'Authorization': `Basic ${Buffer.from(`${process.env.PAYPAL_CLIENT_ID}:${process.env.PAYPAL_CLIENT_SECRET}`).toString('base64')}`
      },
      body: 'grant_type=client_credentials'
    });

    const data = await response.json();
    
    if (response.ok && data.access_token) {
      console.log('✅ PayPal connection successful!');
      console.log('Access token received:', data.access_token.substring(0, 20) + '...');
      console.log('Token type:', data.token_type);
      console.log('Expires in:', data.expires_in, 'seconds');
    } else {
      console.log('❌ PayPal connection failed:');
      console.log('Status:', response.status);
      console.log('Error:', data);
    }
  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

testPayPalConnection();