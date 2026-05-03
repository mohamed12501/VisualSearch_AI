import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { getCaption } from '../lib/services/groqService.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load env from project root
dotenv.config({ path: path.join(__dirname, '../.env.local') });

const app = express();
app.use(express.json());

app.post('/process', async (req, res) => {
  console.log('--- Caption Service Triggered ---');
  const { imageUrl } = req.body;
  
  if (!imageUrl) return res.status(400).json({ error: 'imageUrl is required' });

  try {
    const result = await getCaption(imageUrl);
    console.log('Result:', result);
    res.json({ result });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: error.message });
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`\x1b[36m[Caption Service]\x1b[0m running on http://localhost:${PORT}`);
});
