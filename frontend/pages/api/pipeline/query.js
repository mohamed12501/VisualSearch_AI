import { extractSearchQuery } from '../../../lib/services/queryService';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { caption } = req.body;
  try {
    const searchQuery = await extractSearchQuery(caption);
    res.status(200).json({ searchQuery });
  } catch (error) {
    res.status(500).json({ error: 'Query extraction failed' });
  }
}
