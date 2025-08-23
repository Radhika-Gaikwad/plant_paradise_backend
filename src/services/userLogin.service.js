import { sendResponse } from '../common/common.js';
import { CODES } from '../common/response-code.js';
import { generateAccessToken } from '../security/auth.js';
import { logger } from '../logger/logger.js';
import bcrypt from "bcryptjs";
import { ADMIN_CREDENTIALS } from '../config/admin.config.js';

export default class UserLoginService {
  #userConnection;

  constructor(userConnection) {
    this.#userConnection = userConnection;
  }

  login = async (req) => {
    try {
      const { email, password } = req.body;
      const normalizedEmail = email.trim().toLowerCase();

      // 🔹 Check if it's the admin account
      if (normalizedEmail === ADMIN_CREDENTIALS.email.toLowerCase()) {
        if (password !== ADMIN_CREDENTIALS.password) {
          return sendResponse(CODES.UNAUTHORIZED, 'Invalid admin password');
        }

        const token = await generateAccessToken({
          username: "Admin",
          email: ADMIN_CREDENTIALS.email,
          role: "Admin"
        });

        return sendResponse(CODES.OK, 'User logged in successfully', {
          token,
          user: {
            userId: user._id,
            name: user.name,
            email: user.email,
            mobile: user.mobile,
            gender: user.gender,
            role: user.role === 'User' ? 0 : 1
          }
        });

      }

      // 🔹 Normal user login
      const user = await this.#userConnection.findOne({ email: normalizedEmail });
      if (!user) {
        return sendResponse(CODES.UNAUTHORIZED, 'Invalid email');
      }

      const isMatch = await bcrypt.compare(password.trim(), user.password);
      if (!isMatch) {
        return sendResponse(CODES.UNAUTHORIZED, 'Invalid password');
      }

      const token = await generateAccessToken({
        username: user.name,
        email: user.email,
        role: user.role
      });

      user.lastLogin = new Date().toISOString();
      await user.save();

      return sendResponse(CODES.OK, 'User logged in successfully', {
        token,
        user: {
          userId: user._id,
          name: user.name,
          email: user.email,
          mobile: user.mobile,
          gender: user.gender,
          role: user.role === 'User' ? 0 : 1
        }
      });
    } catch (error) {
      logger.error(error);
      return sendResponse(CODES.INTERNAL_SERVER_ERROR, 'Error in login');
    }
  };
}
