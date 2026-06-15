import dotenv from 'dotenv';
dotenv.config();
const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
  cloudinaryCloudName: process.env.CLOUDINARY_CLOUD_NAME,
  cloudinaryApiKey: process.env.CLOUDINARY_API_KEY,
  cloudinaryApiSecret: process.env.CLOUDINARY_API_SECRET,

  smtpHost: process.env.SMTP_HOST,
  smtpPort: process.env.SMTP_PORT,
  smtpUser: process.env.SMTP_USER,
  smtpPass: process.env.SMTP_PASS,
  smtpSecure: process.env.SMTP_SECURE,
};
if (!config.mongoUri || !config.jwtSecret || !config.cloudinaryCloudName) {
  throw new Error('❌ Faltan variables de entorno críticas. Revisa tu archivo .env');
}
export default config;  