const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');

// Test endpoint for connectivity
router.get('/test', (req, res) => {
    res.status(200).json({ message: 'API is working' });
});

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;
