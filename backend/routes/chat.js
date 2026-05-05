const express = require('express');
const router = express.Router();
const OpenAI = require('openai');

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

router.post('/', async (req, res) => {
  const { message, aporte, years } = req.body;
  try {
    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      max_tokens: 300,
      messages: [
        { role: 'system', content: `Sos un asesor financiero experto en Argentina y mercados globales. El usuario invierte USD ${aporte}/mes durante ${years} años, perfil moderado. Cartera: SPY 20%, XLP 15%, XLV 10%, XLF 10%, NU 5%, TZX28 15%, AL30 10%, YPF 8%, GGAL 7%. Respondé en español, claro y conciso, máximo 100 palabras. Sin asteriscos.` },
        { role: 'user', content: message }
      ]
    });
    res.json({ success: true, reply: completion.choices[0].message.content });
  } catch(e) {
    res.status(500).json({ success: false, error: e.message });
  }
});

module.exports = router;
