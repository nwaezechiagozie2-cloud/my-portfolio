const http = require('http');

const data = JSON.stringify({ password: 'admin' });

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/app/auth/login',
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Content-Length': data.length
  }
};

const req = http.request(options, res => {
  let resData = '';
  res.on('data', d => { resData += d; });
  res.on('end', () => { console.log("Response:", res.statusCode, resData); });
});
req.write(data);
req.end();
