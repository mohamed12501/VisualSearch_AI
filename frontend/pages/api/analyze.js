import { getCaption } from '../../lib/services/groqService';
import { extractSearchQuery } from '../../lib/services/queryService';
import { googleResearch } from '../../lib/services/serpService';
import { summarizeResults } from '../../lib/services/summarizeService';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { imageUrl } = req.body;

  if (!imageUrl) {
    return res.status(400).json({ error: 'Image URL is required' });
  }

  try {
    // 1. Caption
    const caption = await getCaption(imageUrl);
    
    // 2. Search Query
    const searchQuery = await extractSearchQuery(caption);
    
    // 3. Search Results
    const results = await googleResearch(searchQuery);
    
    // 4. Summary
    const summary = await summarizeResults(caption, results);

    res.status(200).json({
      caption,
      searchQuery,
      results,
      summary
    });
  } catch (error) {
    console.error('Analyze handler error:', error);
    res.status(500).json({ error: 'Failed to analyze image' });
  }
}
