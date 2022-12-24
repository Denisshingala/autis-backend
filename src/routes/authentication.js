const express = require("express");
const {
  signUpController,
  login,
  sendEmail,
} = require("../controllers/authController");

//assign router
const router = express.Router();

// User registration
router.post("/login", login);
router.post("/send-email", sendEmail);
router.post("/confirm-email-and-register", signUpController);

module.exports = router;
