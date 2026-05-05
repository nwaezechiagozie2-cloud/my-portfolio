const { execSync } = require('child_process');
try {
  execSync('/root/.local/bin/pip3 install fastapi uvicorn sqlalchemy pymysql alembic pydantic pyjwt passlib[bcrypt] python-multipart cryptography');
  console.log('Dependencies installed successfully.');
} catch (e) {
  console.error("Failed", e.message);
}
