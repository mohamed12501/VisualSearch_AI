import { deleteImage } from '../../lib/services/cloudinaryService';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });
  
  const { publicId } = req.body;
  
  if (!publicId) {
    return res.status(400).json({ error: 'Public ID is required' });
  }

  try {
    await deleteImage(publicId);
    res.status(200).json({ success: true });
  } catch (error) {
    console.error('Delete API error:', error);
    res.status(500).json({ error: 'Failed to delete image' });
  }
}
