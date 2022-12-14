const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const User = require("../models/user");
const nodemailer = require("nodemailer");
const { default: isEmail } = require("validator/lib/isemail");

dotenv.config();

const generateToken = (payload, expiresIn = "2h") => {
  return jwt.sign(payload, process.env.TOKEN_SECRET, {
    expiresIn: expiresIn,
  });
};

const authenticateToken = (req, res, next) => {
  const authheader = req.headers.authorization;
  console.log(authheader);

  if (!authheader) {
    return res.status(401).json({ success: false, error: "Token not passed" });
  }

  if (authheader.split(" ").length !== 2) {
    return res.status(401).json({ success: false, error: "Token is invalid" });
  }

  const token = authheader.split(" ")[1];

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

  if (!isEmail(email)) {
    return res
      .status(400)
      .json({ success: false, error: "Email is not valid!!" });
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

const signUpController = async (req, res) => {
  try {
    const { emailToken } = req.body;

    if (!emailToken) {
      return res
        .status(400)
        .json({ success: false, error: "Token is not passed!" });
    }

    jwt.verify(emailToken, process.env.TOKEN_SECRET, async (err, payload) => {
      if (err) {
        return res
          .status(401)
          .json({ success: false, error: "Token is invalid" });
      }

      try {
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
      } catch (err) {
        console.log(err);
        res.json({ success: false, error: "Signup unsuccessful" });
      }
    });
  } catch (err) {
    console.log(err);
    res.json({ success: false, error: "Signup unsuccessful" });
  }
};

const sendEmail = async (req, res) => {
  try {
    const data = req.body;
    console.log(data);
    // for check user is exist or not
    const check = await User.findOne({ email: data.email });
    if (check) {
      return res.json({ success: false, message: "User already exist" });
    } else {
      const token = generateToken({ data: data }, (expiresIn = "10m"));

      //send email here
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
          console.log(err);
          console.log("Email not sent!");
          res.json({
            success: false,
            error: "Email not sent!",
          });
        } else {
          console.log("Email sent!");
          res.json({
            success: true,
            message: "Email sent, verify email now!",
          });
        }
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
