import express from 'express';
import * as authController from '../controller/auth.controller.js';

const router = express.Router();

// Auth
router.post('/register', authController.register);
router.post('/login', authController.login);

// Profile
router.get('/profile/:userId', authController.getProfile);
router.put('/profile/:userId', authController.updateProfile);

// Address
router.post('/profile/:userId/address', authController.addAddress);
router.put('/profile/:userId/address/:addressId', authController.editAddress);
router.delete('/profile/:userId/address/:addressId', authController.deleteAddress);
router.get('/profile/:userId/address', authController.getAddresses);

export default router;
