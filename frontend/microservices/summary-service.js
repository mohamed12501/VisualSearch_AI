import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { summarizeResults } from '../lib/services/summarizeService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
app.use(express.json());

app.post('/process', async (req, res) => {
  console.log('--- Summary Service Triggered ---');
  const { caption, results } = req.body;
  
  if (!caption || !results) return res.status(400).json({ error: 'caption and results are required' });

  try {
    const result = await summarizeResults(caption, results);
    console.log('Summary generated');
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3004;
app.listen(PORT, () => {
  console.log(`\x1b[33m[Summary Service]\x1b[0m running on http://localhost:${PORT}`);
});
