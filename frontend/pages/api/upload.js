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

  // Check if Cloudinary credentials are set
  if (!process.env.CLOUDINARY_CLOUD_NAME || !process.env.CLOUDINARY_API_KEY || !process.env.CLOUDINARY_API_SECRET) {
    console.error('Cloudinary configuration is missing. Please set CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, and CLOUDINARY_API_SECRET.');
    return res.status(500).json({ error: 'Server configuration error: Missing Cloudinary credentials.' });
  }

  const form = formidable({});
  
  try {
    const [fields, files] = await new Promise((resolve, reject) => {
      form.parse(req, (err, fields, files) => {
        if (err) reject(err);
        resolve([fields, files]);
      });
    });
    
    // In formidable v3, files.image might be an array
    const file = files.image ? (Array.isArray(files.image) ? files.image[0] : files.image) : null;
    
    if (!file) {
      console.warn('Upload attempt with no image field.');
      return res.status(400).json({ error: 'No image uploaded. Ensure the form field is named "image".' });
    }

    console.log('Uploading file to Cloudinary:', file.originalFilename || file.newFilename);
    const result = await uploadImage(file.filepath);
    res.status(200).json(result);
  } catch (error) {
    console.error('Upload handler error:', error.message, error.stack);
    res.status(500).json({ 
      error: 'Internal server error', 
      details: error.message 
    });
  }
}
