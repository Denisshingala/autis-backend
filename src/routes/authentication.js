const express = require("express");
const { signUpController, login } = require("../controllers/authController");

//assign router
const router = express.Router();

// User registration
router.post("/register", signUpController);
router.post("/login", login);

module.exports = router;
