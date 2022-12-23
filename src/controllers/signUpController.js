const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

const signUpController = async (req, res) => {
  try {
    const data = req.body;

    // for check user is exist or not
    const check = await User.findOne({ email: data.email });
    if (check) {
      return res.json({ success: false, message: "User already exist" });
    } else {
      const hash_password = await bcrypt.hash(data.password, 10);
      let userData = new User({
        name: data.name,
        email: data.email,
        password: hash_password,
        gender: data.gender,
        country: data.country,
        DOB: data.DOB,
      });
      await userData.save();
      res.json({ success: true, message: "Successful signup" });
    }
  } catch (err) {
    console.log(err);
    res.json({ success: false, error: "Signup unsuccessful" });
  }
};

module.exports = signUpController;
