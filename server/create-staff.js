const bcrypt = require('bcryptjs');
const { pool } = require('./db');

async function createStaff() {
  const username = process.env.STAFF_USERNAME;
  const password = process.env.STAFF_PASSWORD;

  if (!username || !password) {
    console.log('No STAFF_USERNAME / STAFF_PASSWORD set, so no staff account was created');
    return;
  }

  const passwordHash = await bcrypt.hash(password, 12);
  await pool.query(
    `INSERT INTO staff (username, password_hash) VALUES ($1, $2)
     ON CONFLICT (username) DO UPDATE SET password_hash = EXCLUDED.password_hash`,
    [username, passwordHash]
  );

  console.log(`Staff account ready: ${username}`);
}

createStaff()
  .catch((error) => {
    console.error(error);
    process.exitCode = 1;
  })
  .finally(() => pool.end());
