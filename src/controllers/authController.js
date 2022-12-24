const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");

dotenv.config();

const generateToken = (payload) => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: "2h",
  });
};

const authenticateToken = (req, res, next) => {
  const { token } = req.body;
  if (!token) {
    return res.status(401).json({ success: false, error: "Token not passed" });
  }

  jwt.verify(token, process.env.TOKEN_SECRET, async (err, payload) => {
    if (err) {
      return res
        .status(401)
        .json({ success: false, error: "Token is invalid" });
    }

    const user = await User.findById(payload.id);
    if (!user) {
      return res
        .status(401)
        .json({ success: false, error: "Token is invalid" });
    }
    req.user = user;
    next();
  });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(400)
      .json({ success: false, error: "Email and Password are required!" });
  }

  const user = await User.findOne({ email: email });
  if (!user) {
    return res
      .status(400)
      .json({ success: false, error: "No user with the email found!" });
  }

  const isValidPassword = await bcrypt.compare(password, user.password);
  if (isValidPassword) {
    const token = generateToken({ id: user._id });
    res.json({
      success: true,
      message: "Successful signup",
      data: user,
      token: token,
    });
  } else {
    return res
      .status(400)
      .json({ success: false, error: "Invalid credentials" });
  }
};

// const auth = (req, res) => {
//   try {
//     const { token } = req.body;
//     if (token) {
//       jwt.verify(token, process.env.SECRET_MESSAGE, function (err, payload) {
//         if (err) {
//           return res.json({ success: 0, message: "Access is denied!" });
//         }

//         const { _id } = payload;

//         user
//           .findById(_id)
//           .then((userData) => {
//             return res.json({ success: 1, user: userData });
//           })
//           .catch((err) => {
//             return res.json({ success: 0, message: err });
//           });
//       });
//     } else {
//       res.json({ succes: 0, error: "Access is denied!" });
//     }
//   } catch (err) {
//     console.log(err);
//   }
// };

const signUpController = async (req, res) => {
  try {
    const { emailToken } = req.body;
    jwt.verify(emailToken, process.env.TOKEN_SECRET, async (err, payload) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, error: "Token is invalid" });
      }

      const data = payload.data;
      const hash_password = await bcrypt.hash(data.password, 10);
      let userData = new User({
        name: data.name,
        email: data.email,
        password: hash_password,
        gender: data.gender,
        country: data.country,
        DOB: data.DOB,
      });

      const user = await User(userData).save();
      const token = generateToken({ id: user._id });
      res.json({
        success: true,
        message: "Successful signup",
        data: user,
        token: token,
      });
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, error: "Signup unsuccessful" });
  }
};

const sendEmail = async (req, res) => {
  try {
    const data = req.body;
    // for check user is exist or not
    const check = await User.findOne({ email: data.email });
    if (check) {
      return res.json({ success: false, message: "User already exist" });
    } else {
      const token = generateToken({ data: data });
      //TODO: send email here
      res.json({
        success: true,
        message: "Email sent, verify email now!",
        token: token,
      });
    }
  } catch (err) {
    console.log(err);
    res.json({
      success: false,
      error: "Something went wrong, email not sent!",
    });
  }
};

module.exports = { signUpController, login, sendEmail, authenticateToken };
