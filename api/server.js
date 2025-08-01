import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

const allowedOrigins = process.env.ALLOWED_ORIGINS.split(',');

const app = express();
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

app.use((req, res, next) => {
  const origin = req.headers.origin;
  console.log(`origin: ${origin}`);
  if (allowedOrigins.includes(origin)) {
    res.setHeader('Access-Control-Allow-Origin', origin);
  }
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  next();
});

// Respond to preflight requests
app.options('*', (req, res) => {
  res.sendStatus(200);
});

app.post('/log-analytics', async (req, res) => {
  try {
    const { event, local_user_id, local_session_id, properties } = req.body;

    const { error } = await supabase.from('analytics').insert([
      {
        event,
        local_user_id,
        local_session_id,
        properties,
      },
    ]);

    if (error) throw error;

    res.status(200).json({ ok: true });
  } catch (err) {
    console.error('Error logging analytics:', err);
    res.status(500).json({ error: 'Failed to log analytics' });
  }
});

const port = process.env.PORT || 3001;
app.listen(port, () => console.log(`Server running on port ${port}`));

export default app;
