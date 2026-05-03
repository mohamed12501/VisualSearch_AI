import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { googleResearch } from '../lib/services/serpService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
app.use(express.json());

app.post('/process', async (req, res) => {
  console.log('--- Search Service Triggered ---');
  const { query } = req.body;
  
  if (!query) return res.status(400).json({ error: 'query is required' });

  try {
    const result = await googleResearch(query);
    console.log('Found', result.length, 'results');
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3003;
app.listen(PORT, () => {
  console.log(`\x1b[32m[Search Service]\x1b[0m running on http://localhost:${PORT}`);
});
