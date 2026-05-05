const http = require('http');

setTimeout(() => {
  http.get('http://127.0.0.1:3000', (res) => {
    console.log('Node Server status:', res.statusCode);
  }).on('error', (e) => {
    console.error('Node Server error:', e.message);
  });

  http.get('http://127.0.0.1:3001/app/posts', (res) => {
    console.log('FastAPI Server status:', res.statusCode);
  }).on('error', (e) => {
    console.error('FastAPI Server error:', e.message);
  });
}, 3000);
