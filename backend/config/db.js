const { Pool } = require('pg');
const env = require('./env');

const poolConfig = env.DB.connectionString
  ? {
      connectionString: env.DB.connectionString,
      ssl: env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false,
    }
  : {
      host: env.DB.host,
      port: env.DB.port,
      database: env.DB.database,
      user: env.DB.user,
      password: env.DB.password,
      max: 20, // Max connection pool
      idleTimeoutMillis: 30000,
      connectionTimeoutMillis: 5000,
    };

const pool = new Pool(poolConfig);

pool.on('connect', () => {
  if (env.NODE_ENV !== 'test') {
    // console.log('Connected to PostgreSQL Database pool');
  }
});

pool.on('error', (err) => {
  console.error('Unexpected error on idle PostgreSQL client', err);
});

module.exports = {
  query: (text, params) => pool.query(text, params),
  getClient: () => pool.connect(),
  pool,
};
