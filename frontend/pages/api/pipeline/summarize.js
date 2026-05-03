import { summarizeResults } from '../../../lib/services/summarizeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { caption, results } = req.body;
  try {
    const summary = await summarizeResults(caption, results);
    res.status(200).json({ summary });
  } catch (error) {
    res.status(500).json({ error: 'Summarization failed' });
  }
}
