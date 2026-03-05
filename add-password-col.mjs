import mysql from 'mysql2/promise';

const url = process.env.DATABASE_URL;
const conn = await mysql.createConnection(url + '&ssl={"rejectUnauthorized":false}');

try {
  // Check existing columns
  const [cols] = await conn.query("SHOW COLUMNS FROM affiliate_codes");
  console.log('Columns:', cols.map(c => c.Field));
  
  const hasPassword = cols.some(c => c.Field === 'password');
  if (!hasPassword) {
    await conn.query("ALTER TABLE affiliate_codes ADD COLUMN password VARCHAR(255)");
    console.log('Added password column');
  } else {
    console.log('password column already exists');
  }
} catch (e) {
  if (e.code === 'ER_NO_SUCH_TABLE') {
    console.log('Table affiliate_codes does not exist yet - will be created on first server start');
  } else {
    console.error('Error:', e.message);
  }
} finally {
  await conn.end();
}
