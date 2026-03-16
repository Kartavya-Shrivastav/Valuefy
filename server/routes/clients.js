const express = require('express');
const router = express.Router();
const { getDb, query, queryOne } = require('../services/db');

router.get('/', async (req, res) => {
  const db = await getDb();
  const clients = query(db, 'SELECT * FROM clients', []);
  res.json({ success: true, data: clients });
});

router.get('/:clientId', async (req, res) => {
  const db = await getDb();
  const client = queryOne(db, 'SELECT * FROM clients WHERE client_id = ?', [req.params.clientId]);
  if (!client) return res.status(404).json({ error: 'Client not found' });
  res.json({ success: true, data: client });
});

module.exports = router;