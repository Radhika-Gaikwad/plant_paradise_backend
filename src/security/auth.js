// security/auth.js
import jwt from 'jsonwebtoken';
import config from '../config/index.js';


const JWT_SECRET = process.env.JWT_SECRET || 'yoursecretkey'; // Set in .env
const ACCESS_TOKEN_EXPIRY = '1h';
const REFRESH_TOKEN_EXPIRY = '7d';

export const generateAccessToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: config.jwtExpiresIn });
};

export const generateRefreshToken = (payload) => {
  return jwt.sign(payload, config.jwtSecret, { expiresIn: REFRESH_TOKEN_EXPIRY });
};

export const verifyToken = (token) => {
  try {
    return jwt.verify(token, config.jwtSecret);
  } catch (err) {
    return null;
  }
};
