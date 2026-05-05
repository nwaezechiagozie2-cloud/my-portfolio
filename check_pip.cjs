const { execSync } = require('child_process');
try { console.log(execSync('pip --version').toString()); } catch(e) { console.log('pip fail'); }
try { console.log(execSync('python3 -m pip --version').toString()); } catch(e) { console.log('python3 pip fail'); }
