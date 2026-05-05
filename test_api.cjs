const http = require('http');

const options = {
  hostname: '127.0.0.1',
  port: 3000,
  path: '/app/posts',
  method: 'GET'
};

const req = http.request(options, res => {
  let data = '';
  res.on('data', d => { data += d; });
  res.on('end', () => { console.log("Response:", data); });
});
req.end();
