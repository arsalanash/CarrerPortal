import express from 'express';
import {
  registerAdmin,
  loginAdmin,
  logoutAdmin,
  refreshAdminAccessToken,
  changeAdminPassword,
  getCurrentAdmin,
  updateAdminAccountDetails,
} from '../controller/admin.controller.js';

const router = express.Router();

// Admin routes
router.post('/register', registerAdmin);
router.post('/login', loginAdmin);
router.post('/logout', logoutAdmin);
router.post('/refresh-token', refreshAdminAccessToken);
router.put('/change-password', changeAdminPassword);
router.get('/me', getCurrentAdmin);
router.put('/update', updateAdminAccountDetails);

export default router;