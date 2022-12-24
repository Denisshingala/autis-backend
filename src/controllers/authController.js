const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");

dotenv.config();

const generateToken = (payload, expiresIn = "2h") => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expiresIn,
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
      const token = generateToken({ data: data }, (expiresIn = "10m"));

      //TODO: send email here
      const transporter = nodemailer.createTransport({
        service: process.env.EMAIL_SERVICE,
        auth: {
          user: process.env.EMAIL_USER,
          pass: process.env.EMAIL_PASS,
        },
      });

      let mailOptions = {
        from: process.env.EMAIL_USER,
        to: data.email,
        subject: `${process.env.APP_NAME || "AutsiLearn"} - Verify Email`,
        html: `To verify your email, click here: <a href=${
          process.env.CONFIRM_URL + "?token=" + token
        }>${token}</a>`,
      };

      transporter.sendMail(mailOptions, (err) => {
        if (err) {
          console.log("Email not sent!");
        } else {
          console.log("Email sent!");
        }
      });

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
      error: "Something went wrong, email not sent! " + err,
    });
  }
};

module.exports = { signUpController, login, sendEmail, authenticateToken };
