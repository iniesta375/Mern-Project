const express    = require('express');
const multer     = require('multer');
const authController         = require('../controllers/authController.js');
const medicationController   = require('../controllers/medicationController.js');
const adherenceController    = require('../controllers/adherenceController.js');
const wellnessController     = require('../controllers/wellnessController.js');
const reportController       = require('../controllers/reportController.js');
const notificationController = require('../controllers/notificationController.js');
const { authenticateToken }  = require('../models/auth.js');

const router = express.Router();

const upload = multer({
  storage: multer.memoryStorage(),
  limits: { fileSize: 5 * 1024 * 1024 },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) cb(null, true);
    else cb(new Error('Only image files are allowed'), false);
  },
});

router.get('/test-email', async (req, res) => {
  const nodemailer = require('nodemailer');
  const transporter = nodemailer.createTransport({
    host: 'smtp.gmail.com',
    port: 465,
    secure: true,
    auth: {
      user: process.env.GMAIL_USER,
      pass: process.env.GMAIL_APP_PASSWORD,
    },
  });
  try {
    const info = await transporter.sendMail({
      from: `"MediWell Test" <${process.env.GMAIL_USER}>`,
      to: 'ajayiinioluwa2007@gmail.com',
      subject: 'MediWell Test Email',
      text: 'If you got this, nodemailer is working correctly.',
    });
    res.json({ success: true, messageId: info.messageId, response: info.response });
  } catch (err) {
    res.json({ success: false, error: err.message, code: err.code });
  }
});


router.post('/auth/register',         authController.register);
router.post('/auth/login',            authController.login);
router.post('/auth/google',           authController.googleLogin);
router.get('/auth/me',                authenticateToken, authController.me);
router.put('/auth/profile',           authenticateToken, authController.updateProfile);
router.put('/auth/preferences',       authenticateToken, authController.updatePreferences);
router.post('/auth/avatar',           authenticateToken, upload.single('avatar'), authController.uploadAvatar);
router.delete('/auth/account',        authenticateToken, authController.deleteAccount);

router.post('/auth/forgot-password',  authController.forgotPassword);
router.post('/auth/reset-password',   authController.resetPassword);

router.get('/medications',            authenticateToken, medicationController.list);
router.post('/medications',           authenticateToken, medicationController.create);
router.delete('/medications/:id',     authenticateToken, medicationController.remove);

router.get('/adherence/today',        authenticateToken, adherenceController.getToday);
router.post('/adherence/log',         authenticateToken, adherenceController.log);
router.get('/adherence/stats',        authenticateToken, adherenceController.getStats);

router.get('/wellness/logs',          authenticateToken, wellnessController.list);
router.post('/wellness/log',          authenticateToken, wellnessController.log);

router.get('/reports/summary',        authenticateToken, reportController.getSummary);

router.post('/notifications/send-reminders', authenticateToken, notificationController.sendReminders);

module.exports = router;