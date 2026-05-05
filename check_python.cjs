const { exec } = require('child_process');
exec('python3 --version', (err, stdout, stderr) => {
  if (err) {
    console.log('Python3 not found:', err.message);
    return;
  }
  console.log('Python3:', stdout);
});
exec('pip3 --version', (err, stdout, stderr) => {
  if (err) {
    console.log('Pip3 not found:', err.message);
    return;
  }
  console.log('Pip3:', stdout);
});
