// src/config/index.js
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';

// Needed to replicate __dirname in ESM
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({
  path: process.env.NODE_ENV === 'test' ? '.env.test' : '.env',
});

export default {
 
  nodeEnv: process.env.NODE_ENV || 'development',
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb+srv://hr1qsis:62X7OOFWB0jLVs3J@qsis.ndk49xu.mongodb.net/?retryWrites=true&w=majority',
  jwtSecret: process.env.JWT_SECRET || 'be6e1bc1bf4cc36e4767ebdd79f61c0fdb84808d3c97573e27a8387f9a308fe4295bec566f5ad5148949742c33532faebfebe9a2e1ef661fd784cfec53d7bfc3',
  jwtExpiresIn: process.env.JWT_EXPIRES_IN || '1h',
};
