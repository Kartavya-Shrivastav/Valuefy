const { getDb, query, queryOne, run, persist } = require('./db');

async function getRebalanceData(clientId) {
  const db = await getDb();

  const client = queryOne(db, 'SELECT * FROM clients WHERE client_id = ?', [clientId]);
  if (!client) throw new Error(`Client ${clientId} not found`);

  const holdings = query(db, 'SELECT * FROM client_holdings WHERE client_id = ?', [clientId]);
  const modelFunds = query(db, 'SELECT * FROM model_funds', []);

  const totalValue = holdings.reduce((sum, h) => sum + h.current_value, 0);
  const holdingMap = {};
  holdings.forEach(h => { holdingMap[h.fund_id] = h; });
  const modelFundIds = new Set(modelFunds.map(f => f.fund_id));

  const items = [];

  // In-plan funds
  modelFunds.forEach(mf => {
    const holding = holdingMap[mf.fund_id];
    const currentValue = holding ? holding.current_value : 0;
    const currentPct = totalValue > 0 ? (currentValue / totalValue) * 100 : 0;
    const targetPct = mf.allocation_pct;
    const drift = targetPct - currentPct;
    const amount = (drift / 100) * totalValue;

    let action;
    if (amount > 0.5)       action = 'BUY';
    else if (amount < -0.5) action = 'SELL';
    else                    action = 'HOLD';

    items.push({
      fund_id:            mf.fund_id,
      fund_name:          mf.fund_name,
      asset_class:        mf.asset_class,
      is_model_fund:      1,
      current_value:      currentValue,
      current_pct:        parseFloat(currentPct.toFixed(2)),
      target_pct:         targetPct,
      drift:              parseFloat(drift.toFixed(2)),
      amount:             Math.round(Math.abs(amount)),
      action,
      post_rebalance_pct: parseFloat(targetPct.toFixed(2)),
    });
  });

  // Out-of-plan funds (e.g. Axis Bluechip F006)
  holdings.forEach(h => {
    if (!modelFundIds.has(h.fund_id)) {
      const currentPct = totalValue > 0 ? (h.current_value / totalValue) * 100 : 0;
      items.push({
        fund_id:            h.fund_id,
        fund_name:          h.fund_name,
        asset_class:        null,
        is_model_fund:      0,
        current_value:      h.current_value,
        current_pct:        parseFloat(currentPct.toFixed(2)),
        target_pct:         null,
        drift:              null,
        amount:             h.current_value,
        action:             'REVIEW',
        post_rebalance_pct: parseFloat(currentPct.toFixed(2)),
      });
    }
  });

  const totalToBuy    = items.filter(i => i.action === 'BUY').reduce((s, i) => s + i.amount, 0);
  const totalToSell   = items.filter(i => i.action === 'SELL').reduce((s, i) => s + i.amount, 0);
  const netCashNeeded = totalToBuy - totalToSell;

  return { client, totalValue, totalToBuy, totalToSell, netCashNeeded, items };
}

async function saveRebalancingSession(clientId, data) {
  const db = await getDb();
  const { totalValue, totalToBuy, totalToSell, netCashNeeded, items } = data;

  const sessionId = run(db,
    `INSERT INTO rebalance_sessions
      (client_id, created_at, portfolio_value, total_to_buy, total_to_sell, net_cash_needed, status)
     VALUES (?, datetime('now'), ?, ?, ?, ?, 'PENDING')`,
    [clientId, totalValue, totalToBuy, totalToSell, netCashNeeded]
  );

  items.forEach(item => {
    run(db,
      `INSERT INTO rebalance_items
        (session_id, fund_id, fund_name, action, amount,
         current_pct, target_pct, post_rebalance_pct, is_model_fund)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [sessionId, item.fund_id, item.fund_name, item.action, item.amount,
       item.current_pct, item.target_pct, item.post_rebalance_pct, item.is_model_fund]
    );
  });

  persist(db);
  return sessionId;
}

module.exports = { getRebalanceData, saveRebalancingSession };