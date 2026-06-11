import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 4000,
  mongoUri: process.env.MONGO_URI,
  jwtSecret: process.env.JWT_SECRET,
};

if (!config.mongoUri || !config.jwtSecret) {
  throw new Error('❌ Faltan variables de entorno críticas (MONGO_URI o JWT_SECRET). Revisa tu archivo .env');
}

export default config;