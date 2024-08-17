import pg from "pg";

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
});

export const query = async (text: string, params?: any) => {
  const client = await pool.connect();
  try {
    const res = await client.query(text, params);
    return res;
  } finally {
    client.release();
  }
};
