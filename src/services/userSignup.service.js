import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { logger } from '../logger/logger.js';
import { generateAccessToken } from '../security/auth.js';
import bcrypt from 'bcryptjs';

export default class UserSignupService {
  #userConnection;

  constructor(userConnection) {
    this.#userConnection = userConnection;
  }

  signup = async (req) => {
    try {
      const { name, email, mobile, gender, password, confirmPassword } = req.body;

      // Basic validation
      if (!name || !email || !mobile || !gender || !password || !confirmPassword) {
        return sendResponse(CODES.BAD_REQUEST, 'All fields are required');
      }

      if (password !== confirmPassword) {
        return sendResponse(CODES.BAD_REQUEST, 'Passwords do not match');
      }

      const normalizedEmail = email.toLowerCase();

      // Check if email already exists
      logger.info('Checking whether email is already in database');
      let userExists = await this.#userConnection.findOne({ email: normalizedEmail });
      if (userExists) {
        return sendResponse(CODES.BAD_REQUEST, 'Email already exists. Please use a different email.');
      }



      const newUser = await this.#userConnection.create({
        name,
        email: normalizedEmail,
        mobile,
        gender,
        password
      });

      // Generate token
      const token = await generateAccessToken({
        username: newUser.name,
        email: newUser.email,
        role: newUser.role || 'User',
      });

      return sendResponse(CODES.OK, 'User signed up successfully', { token });
    } catch (error) {
      logger.error(error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in signup');
    }
  };
}
