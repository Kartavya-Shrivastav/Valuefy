const express = require('express');
const cors = require('cors');

const clientsRouter   = require('./routes/clients');
const rebalanceRouter = require('./routes/rebalance');
const historyRouter   = require('./routes/history');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: process.env.CLIENT_URL || 'http://localhost:5173'
}));

app.use(express.json());

app.get('/api/health', (req, res) => res.json({ status: 'ok' }));
app.use('/api/clients',   clientsRouter);
app.use('/api/rebalance', rebalanceRouter);
app.use('/api/history',   historyRouter);

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

PORT=5000
CLIENT_URL=https://your-frontend.vercel.app