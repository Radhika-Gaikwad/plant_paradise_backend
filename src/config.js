// config.js
import dotenv from 'dotenv';

dotenv.config();

const config = {
  port: process.env.PORT || 5000,
  mongoURI: process.env.MONGO_URI || 'mongodb://localhost:27017/plant_paradise',
  jwtSecret: process.env.JWT_SECRET || 'be6e1bc1bf4cc36e4767ebdd79f61c0fdb84808d3c97573e27a8387f9a308fe4295bec566f5ad5148949742c33532faebfebe9a2e1ef661fd784cfec53d7bfc3',
  nodeEnv: process.env.NODE_ENV || 'development',
};

export default config;
