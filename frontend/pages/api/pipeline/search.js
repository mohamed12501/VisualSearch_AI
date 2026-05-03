import { googleResearch } from '../../../lib/services/serpService';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { searchQuery } = req.body;
  try {
    const results = await googleResearch(searchQuery);
    res.status(200).json({ results });
  } catch (error) {
    res.status(500).json({ error: 'Search failed' });
  }
}
