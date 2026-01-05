import sql from 'mssql'; // default import only

if (!process.env.DB_USER || !process.env.DB_HOST || !process.env.DB_NAME) {
  throw new Error('Missing DB environment variables');
}

const config: sql.config = {
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD || '',
  server: process.env.DB_HOST,
  database: process.env.DB_NAME,
  // port: 1433,
  options: {
    encrypt: false,
    trustServerCertificate: true,
    instanceName: 'SQLEXPRESS01',   
  },
};

let pool: sql.ConnectionPool | null = null;

export async function connectToDB(): Promise<sql.ConnectionPool> {
  if (pool) return pool;

  try {
    pool = await sql.connect(config); // returns ConnectionPool
    return pool;
  } catch (err) {
    console.error('DB Connection Error:', err);
    throw err;
  }
}
