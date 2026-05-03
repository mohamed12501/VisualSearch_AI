import { getCaption } from '../../../lib/services/groqService';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  const { imageUrl } = req.body;
  try {
    const caption = await getCaption(imageUrl);
    res.status(200).json({ caption });
  } catch (error) {
    res.status(500).json({ error: 'Captioning failed' });
  }
}
