import User from '../models/user.model.js';
import UserSignupService from '../services/userSignup.service.js';
import UserLoginService from '../services/userLogin.service.js';

const signupService = new UserSignupService(User);
const loginService = new UserLoginService(User);

export const register = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const result = await signupService.signup(req);
  res.status(result.code).json(result);
};

export const login = async (req, res) => {
  if (!req.body.email || !req.body.password) {
    return res.status(400).json({ message: 'Email and password are required' });
  }
  const result = await loginService.login(req);
  res.status(result.code).json(result);
};
