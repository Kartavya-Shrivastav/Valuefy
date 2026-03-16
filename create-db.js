const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

async function createDb() {
  const SQL = await initSqlJs();
  const db = new SQL.Database();

  db.run(`
    CREATE TABLE clients (
      client_id TEXT PRIMARY KEY,
      client_name TEXT,
      total_invested REAL
    );
    CREATE TABLE model_funds (
      fund_id TEXT PRIMARY KEY,
      fund_name TEXT,
      asset_class TEXT,
      allocation_pct REAL
    );
    CREATE TABLE client_holdings (
      holding_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      fund_id TEXT,
      fund_name TEXT,
      current_value REAL
    );
    CREATE TABLE rebalance_sessions (
      session_id INTEGER PRIMARY KEY AUTOINCREMENT,
      client_id TEXT,
      created_at TEXT,
      portfolio_value REAL,
      total_to_buy REAL,
      total_to_sell REAL,
      net_cash_needed REAL,
      status TEXT
    );
    CREATE TABLE rebalance_items (
      item_id INTEGER PRIMARY KEY AUTOINCREMENT,
      session_id INTEGER,
      fund_id TEXT,
      fund_name TEXT,
      action TEXT,
      amount REAL,
      current_pct REAL,
      target_pct REAL,
      post_rebalance_pct REAL,
      is_model_fund INTEGER
    );
  `);

  // Clients
  db.run(`INSERT INTO clients VALUES ('C001', 'Amit Sharma',  500000)`);
  db.run(`INSERT INTO clients VALUES ('C002', 'Priya Nair',   300000)`);
  db.run(`INSERT INTO clients VALUES ('C003', 'Rohan Mehta',  400000)`);

  // Model funds
  db.run(`INSERT INTO model_funds VALUES ('F001', 'Mirae Asset Large Cap Fund',       'EQUITY', 30)`);
  db.run(`INSERT INTO model_funds VALUES ('F002', 'Parag Parikh Flexi Cap Fund',      'EQUITY', 25)`);
  db.run(`INSERT INTO model_funds VALUES ('F003', 'HDFC Mid Cap Opportunities Fund',  'EQUITY', 20)`);
  db.run(`INSERT INTO model_funds VALUES ('F004', 'ICICI Prudential Bond Fund',       'DEBT',   15)`);
  db.run(`INSERT INTO model_funds VALUES ('F005', 'Nippon India Gold ETF',            'GOLD',   10)`);

  // Amit C001 — includes out-of-plan F006
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C001','F001','Mirae Asset Large Cap Fund',90000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C001','F002','Parag Parikh Flexi Cap Fund',155000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C001','F003','HDFC Mid Cap Opportunities Fund',0)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C001','F004','ICICI Prudential Bond Fund',110000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C001','F005','Nippon India Gold ETF',145000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C001','F006','Axis Bluechip Fund',80000)`);

  // Priya C002
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C002','F001','Mirae Asset Large Cap Fund',100000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C002','F002','Parag Parikh Flexi Cap Fund',80000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C002','F004','ICICI Prudential Bond Fund',60000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C002','F005','Nippon India Gold ETF',60000)`);

  // Rohan C003
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C003','F001','Mirae Asset Large Cap Fund',150000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C003','F003','HDFC Mid Cap Opportunities Fund',120000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C003','F004','ICICI Prudential Bond Fund',80000)`);
  db.run(`INSERT INTO client_holdings (client_id,fund_id,fund_name,current_value) VALUES ('C003','F005','Nippon India Gold ETF',50000)`);

  // Save to file
  const data = db.export();
  fs.writeFileSync(path.join(__dirname, 'model_portfolio.db'), Buffer.from(data));
  console.log('✓ model_portfolio.db created successfully');
}

createDb().catch(console.error);