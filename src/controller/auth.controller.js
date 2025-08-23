import User from '../models/user.model.js';
import UserSignupService from '../services/userSignup.service.js';
import UserLoginService from '../services/userLogin.service.js';
import AddressService from '../services/address.service.js';

const signupService = new UserSignupService(User);
const loginService = new UserLoginService(User);
const addressService = new AddressService(User);

// ----------------- Auth -----------------
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

// ----------------- Profile -----------------
export const getProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const user = await User.findById(userId).select("name email mobile gender address");
    if (!user) return res.status(404).json({ message: "User not found" });
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const updateProfile = async (req, res) => {
  try {
    const { userId } = req.params;
    const { name, gender, mobile } = req.body;

    const user = await User.findByIdAndUpdate(
      userId,
      { $set: { name, gender, mobile } },
      { new: true, runValidators: true }
    ).select("name email mobile gender address");

    if (!user) return res.status(404).json({ message: "User not found" });
    res.json({ message: "Profile updated successfully", user });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

// ----------------- Address -----------------
export const addAddress = async (req, res) => {
  const { userId } = req.params;
  const result = await addressService.addAddress(userId, req.body);
  res.status(result.code).json(result);
};

export const editAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const result = await addressService.editAddress(userId, addressId, req.body);
  res.status(result.code).json(result);
};

export const deleteAddress = async (req, res) => {
  const { userId, addressId } = req.params;
  const result = await addressService.deleteAddress(userId, addressId);
  res.status(result.code).json(result);
};


export const getAddresses = async (req, res) => {
  const { userId } = req.params;
  const result = await addressService.getAddresses(userId);
  res.status(result.code).json(result);
};
