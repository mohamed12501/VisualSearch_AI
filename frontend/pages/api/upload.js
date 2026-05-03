import formidable from 'formidable';
import { uploadImage } from '../../lib/services/cloudinaryService';

export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const form = formidable({});
  
  try {
    const [fields, files] = await form.parse(req);
    const file = files.image[0];
    
    if (!file) {
      return res.status(400).json({ error: 'No image uploaded' });
    }

    const result = await uploadImage(file.filepath);
    res.status(200).json(result);
  } catch (error) {
    console.error('Upload handler error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
}
