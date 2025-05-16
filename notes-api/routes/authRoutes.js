const router = require('express').Router();
const { register, login } = require('../controllers/authController');
const { validateUserRegistration, validateUserLogin } = require('../middleware/validationMiddleware');

router.post('/register', validateUserRegistration, register);
router.post('/login', validateUserLogin, login);

module.exports = router;
