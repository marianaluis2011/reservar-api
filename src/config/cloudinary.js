import { v2 as cloudinary } from 'cloudinary';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import multer from 'multer';
import config from './config.js';

cloudinary.config({
  cloud_name: config.cloudinaryCloudName,
  api_key: config.cloudinaryApiKey,
  api_secret: config.cloudinaryApiSecret,
});

const storage = new CloudinaryStorage({
  cloudinary: cloudinary,
  params: {
    folder: 'reservas-api',
    allowed_formats: ['jpg', 'png', 'jpeg', 'webp'],
    transformation: [{ width: 1000, height: 1000, crop: 'limit' }],
  },
});

const upload = multer({ 
  storage: storage,
  limits: { fileSize: 2 * 1024 * 1024 } // Límite de 2MB por archivo
});

const extraerPublicId = (url) => {
  if (!url || typeof url !== 'string') return null;
  const parts = url.split('/');
  const folder = parts[parts.length - 2];
  const fileName = parts[parts.length - 1].split('.')[0];
  return `${folder}/${fileName}`;
};

export { cloudinary, upload, extraerPublicId };