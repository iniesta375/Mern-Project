const express = require('express');
const authController = require('../controllers/authController.js');
const medicationController = require('../controllers/medicationController.js');
const adherenceController = require('../controllers/adherenceController.js');
const wellnessController = require('../controllers/wellnessController.js');
const reportController = require('../controllers/reportController.js');
const { authenticateToken } = require('../models/auth.js');

const router = express.Router();

router.post('/auth/register', authController.register);
router.post('/auth/login', authController.login);
router.get('/auth/me', authenticateToken, authController.me);

router.get('/medications', authenticateToken, medicationController.list);
router.post('/medications', authenticateToken, medicationController.create);
router.delete('/medications/:id', authenticateToken, medicationController.remove);

router.get('/adherence/today', authenticateToken, adherenceController.getToday);
router.post('/adherence/log', authenticateToken, adherenceController.log);
router.get('/adherence/stats', authenticateToken, adherenceController.getStats);

router.get('/wellness/logs', authenticateToken, wellnessController.list);
router.post('/wellness/log', authenticateToken, wellnessController.log);

router.get('/reports/summary', authenticateToken, reportController.getSummary);

router.put('/auth/profile',      authenticateToken, authController.updateProfile);
router.put('/auth/preferences',  authenticateToken, authController.updatePreferences);
router.delete('/auth/account',   authenticateToken, authController.deleteAccount);

module.exports = router;
