const express = require('express');
const router = express.Router();
const { getDb, query, run, persist } = require('../services/db');

router.get('/:clientId', async (req, res) => {
  const db = await getDb();
  const sessions = query(db,
    'SELECT * FROM rebalance_sessions WHERE client_id = ? ORDER BY created_at DESC',
    [req.params.clientId]
  );
  const result = sessions.map(session => ({
    ...session,
    items: query(db, 'SELECT * FROM rebalance_items WHERE session_id = ?', [session.session_id]),
  }));
  res.json({ success: true, data: result });
});

router.patch('/:sessionId/status', async (req, res) => {
  const { status } = req.body;
  if (!['APPLIED', 'DISMISSED', 'PENDING'].includes(status))
    return res.status(400).json({ error: 'Invalid status' });
  const db = await getDb();
  run(db, 'UPDATE rebalance_sessions SET status = ? WHERE session_id = ?',
    [status, req.params.sessionId]);
  persist(db);
  res.json({ success: true, message: `Status updated to ${status}` });
});

module.exports = router;