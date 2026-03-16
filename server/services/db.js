const initSqlJs = require('sql.js');
const fs = require('fs');
const path = require('path');

const DB_PATH = path.resolve(__dirname, '..', '..', 'model_portfolio.db');
let dbInstance = null;

async function getDb() {
  if (dbInstance) return dbInstance;
  const SQL = await initSqlJs();
  const fileBuffer = fs.readFileSync(DB_PATH);
  dbInstance = new SQL.Database(fileBuffer);
  console.log('✓ DB loaded from:', DB_PATH);
  return dbInstance;
}

function query(db, sql, params = []) {
  const stmt = db.prepare(sql);
  stmt.bind(params);
  const rows = [];
  while (stmt.step()) rows.push(stmt.getAsObject());
  stmt.free();
  return rows;
}

function queryOne(db, sql, params = []) {
  return query(db, sql, params)[0] || null;
}

function run(db, sql, params = []) {
  db.run(sql, params);
  const result = db.exec('SELECT last_insert_rowid() as id');
  return result[0]?.values[0][0];
}

function persist(db) {
  const data = db.export();
  fs.writeFileSync(DB_PATH, Buffer.from(data));
}

module.exports = { getDb, query, queryOne, run, persist };