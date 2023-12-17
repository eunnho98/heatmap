const { Pool } = require('pg');

// 데이터베이스 연결 정보 설정
const pool = new Pool({
  user: 'postgres',
  host: process.env.NEXT_PUBLIC_DB_HOST,
  database: 'touch',
  password: process.env.NEXT_PUBLIC_DB_PASSWORD,
  port: 5432,
});

module.exports = pool;
