const express = require('express');
const mysql = require('mysql2/promise');
const app = express();
app.use(express.json());

const pool = mysql.createPool({
  host: 'gateway01.ap-southeast-1.prod.aws.tidbcloud.com',
  port: 4000,
  user: 'ET8kyAFN4ZTeTkP.root',
  password: 'Uf3NVjkweRcnuTr1',
  database: 'expense_tracker',
  waitForConnections: true,
  connectionLimit: 5,
  ssl: { minVersion: 'TLSv1.2' }
});

app.post('/query', async (req, res) => {
  if (req.headers['x-api-key'] !== 'your-secret-key') {
    return res.status(401).json({ error: 'Unauthorized' });
  }
  const { sql, params } = req.body;
  if (!sql) return res.status(400).json({ error: 'Missing sql' });
  try {
    const [rows] = await pool.execute(sql, params || []);
    res.json({ rows });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.get('/health', (req, res) => res.json({ ok: true }));

app.listen(process.env.PORT || 10000, () => {
  console.log('Proxy running on port ' + process.env.PORT);
});   
