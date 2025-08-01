import express from 'express';
import cors from 'cors';
import { createClient } from '@supabase/supabase-js';

console.log(process.env.ALLOWED_ORIGINS);

const app = express();
app.use(
  cors({
    origin: process.env.ALLOWED_ORIGINS.split(','),
    methods: ['POST', 'OPTIONS'],
    allowedHeaders: ['Content-Type'],
  })
);
app.use(express.json());

console.log(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);
const supabase = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

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
