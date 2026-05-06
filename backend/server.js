const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'OPTIONS'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

const pricesRouter = require('./routes/prices');
app.use('/api/prices', pricesRouter);

const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);

app.get('/', (req, res) => res.json({ status: 'OK', message: 'Asesor Financiero IA' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));

app.listen(PORT, () => console.log('Servidor en puerto ' + PORT));
