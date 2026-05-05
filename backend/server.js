const express = require('express');
const cors = require('cors');
const app = express();
const PORT = process.env.PORT || 3000;
app.use(cors());
app.use(express.json());
app.use((req, res, next) => { console.log(`[${new Date().toLocaleTimeString('es-AR')}] ${req.method} ${req.url}`); next(); });
const pricesRouter = require('./routes/prices');
app.use('/api/prices', pricesRouter);
app.get('/', (req, res) => res.json({ status: 'OK', message: '🚀 Plataforma Inversión IA - Oscar' }));
app.get('/health', (req, res) => res.json({ status: 'healthy', timestamp: new Date().toISOString() }));
app.listen(PORT, () => { console.log(`\n✅ Servidor en http://localhost:${PORT}\n`); });

const { default: fetch } = require('node-fetch');

app.post('/api/chat', async (req, res) => {
  const { message, context } = req.body;
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 1000,
        messages: [{ role: 'user', content: `${context}\n\nPregunta: ${message}` }]
      })
    });
    const data = await response.json();
    res.json({ success: true, reply: data.content?.[0]?.text || 'Sin respuesta' });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

const chatRouter = require('./routes/chat');
app.use('/api/chat', chatRouter);
