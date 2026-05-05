const { execSync } = require('child_process');
try {
  execSync('curl -sSL https://bootstrap.pypa.io/get-pip.py -o get-pip.py');
  execSync('python3 get-pip.py --user');
  console.log('Pip installed successfully.');
} catch (e) {
  console.error("Failed to install pip", e.message);
}
