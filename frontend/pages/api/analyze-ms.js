import axios from 'axios';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  const { imageUrl } = req.body;
  if (!imageUrl) return res.status(400).json({ error: 'Image URL is required' });

  try {
    console.log('>>> Starting Microservices Pipeline <<<');

    // 1. Call Caption Service (5001)
    const captionRes = await axios.post('http://localhost:5001/process', { imageUrl });
    const caption = captionRes.data.result;
    console.log('1. Caption Service Success');

    // 2. Call Query Service (5002)
    const queryRes = await axios.post('http://localhost:5002/process', { caption });
    const searchQuery = queryRes.data.result;
    console.log('2. Query Service Success');

    // 3. Call Search Service (5003)
    const searchRes = await axios.post('http://localhost:5003/process', { query: searchQuery });
    const results = searchRes.data.result;
    console.log('3. Search Service Success');

    // 4. Call Summary Service (5004)
    const summaryRes = await axios.post('http://localhost:5004/process', { caption, results });
    const summary = summaryRes.data.result;
    console.log('4. Summary Service Success');

    res.status(200).json({
      architecture: 'Microservices',
      caption,
      searchQuery,
      results,
      summary
    });

  } catch (error) {
    console.error('Microservices orchestration error:', error.message);
    res.status(500).json({ 
      error: 'Microservices pipeline failed. Make sure all services are running in their terminals!',
      details: error.message 
    });
  }
}
