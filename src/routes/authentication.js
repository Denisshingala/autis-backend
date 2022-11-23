const express = require('express');
const signUpController = require('../controllers/signUpController');

//assign router
const router = express.Router();

// User registration
router.post('/register', signUpController);

module.exports = router;