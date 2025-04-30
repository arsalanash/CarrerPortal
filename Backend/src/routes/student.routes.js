import express from 'express';
import {
  registerStudent,
  loginStudent,
  logoutStudent,
  refreshStudentAccessToken,
  changeStudentPassword,
  getCurrentStudent,
  updateStudentAccountDetails,
} from '../controller/student.controller.js';

const router = express.Router();

// Student routes
router.post('/register', registerStudent);
router.post('/login', loginStudent);
router.post('/logout', logoutStudent);
router.post('/refresh-token', refreshStudentAccessToken);
router.put('/change-password', changeStudentPassword);
router.get('/me', getCurrentStudent);
router.put('/update', updateStudentAccountDetails);

export default router;