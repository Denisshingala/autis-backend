const mongoose = require("mongoose");
const { default: isEmail } = require("validator/lib/isemail");

const userSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: [isEmail, "Invalid Email!!"],
  },
  DOB: Date,
  gender: {
    type: String,
    enum: ["Male", "Female", "Other"],
  },
  country: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
    minlength: 8,
  },
  isActive: {
    type: Boolean,
    default: true,
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
