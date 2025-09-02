const express = require('express');
const router = express.Router();
const userController = require('../controllers/userConrtroller');
const authMiddleware = require('../middlewares/auth');

// Protect all routes after this middleware
router.use(authMiddleware.protect);

router.get('/', userController.getAllUsers);
router.get('/:id', userController.getUser);
router.patch('/:id', userController.updateUser);

module.exports = router;
