const express = require('express');
const router = express.Router();
const { getRebalanceData, saveRebalancingSession } = require('../services/rebalanceEngine');

router.get('/:clientId', async (req, res) => {
  try {
    const data = await getRebalanceData(req.params.clientId);
    res.json({ success: true, data });
  } catch (err) {
    res.status(404).json({ success: false, error: err.message });
  }
});

router.post('/save', async (req, res) => {
  try {
    const { clientId } = req.body;
    if (!clientId) return res.status(400).json({ error: 'clientId required' });
    const data = await getRebalanceData(clientId);
    const sessionId = await saveRebalancingSession(clientId, data);
    res.json({ success: true, sessionId, message: 'Rebalancing saved' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;