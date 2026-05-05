const { execSync } = require('child_process');
try {
  const out = execSync('python3 -c "import fastapi_backend.main"', {stdio: 'pipe'}).toString();
  console.log("Success:", out);
} catch (e) {
  console.error("Failed", e.stderr.toString(), e.stdout.toString());
}
