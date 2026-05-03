import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { extractSearchQuery } from '../lib/services/queryService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
app.use(express.json());

app.post('/process', async (req, res) => {
  console.log('--- Query Service Triggered ---');
  const { caption } = req.body;
  
  if (!caption) return res.status(400).json({ error: 'caption is required' });

  try {
    const result = await extractSearchQuery(caption);
    console.log('Result:', result);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3002;
app.listen(PORT, () => {
  console.log(`\x1b[35m[Query Service]\x1b[0m running on http://localhost:${PORT}`);
});
