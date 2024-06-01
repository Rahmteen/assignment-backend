require("dotenv").config();

const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const db = require("../models");

const MESSAGES = {
  fieldsRequired: "All fields are required",
  emailInUse: "Email already in use",
  usernameInUse: "Username already in use",
  emailPasswordRequired: "Email and password are required",
  invalidEmailPassword: "Invalid email or password",
  passwordNotSet: "Password not set, please login with Google",
  userCreated: "User created successfully",
  loginSuccess: "User logged in successfully",
  twoFactorRequired: "Two-factor authentication required",
  googleAuthSuccess: "Google authentication successful",
  serverError: "Internal server error",
};

/**
 * Signup a new user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.signup = async (req, res) => {
  const { fullName, username, email, password, webToken } = req.body;

  if (!fullName || !username || !email || typeof password === "undefined") {
    return res.status(400).json({ error: MESSAGES.fieldsRequired });
  }

  try {
    const existingEmailUser = await db.Profile.findOne({ where: { email } });
    if (existingEmailUser) {
      return res.status(400).json({ error: MESSAGES.emailInUse });
    }

    const existingUsernameUser = await db.Profile.findOne({ where: { username } });
    if (existingUsernameUser) {
      return res.status(400).json({ error: MESSAGES.usernameInUse });
    }

    const hashedPassword = password ? await bcrypt.hash(password, 10) : null;

    const newUser = await db.Profile.create({
      fullName,
      username,
      email,
      password: hashedPassword,
      active: true,
    });

    await db.Notification.create({
      profileId: newUser.id,
      webToken: webToken || null,
      email: email,
      receiveNotifications: false,
    });

    await db.TwoFactor.create({
      profileId: newUser.id,
      twoFactorSecret: "",
      twoFactorEnabled: false,
    });

    const token = jwt.sign({ id: newUser.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    const user = newUser.toJSON();
    delete user.password;

    res.status(201).json({ token, user, message: MESSAGES.userCreated });
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Login a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ error: MESSAGES.emailPasswordRequired });
  }

  try {
    const user = await db.Profile.findOne({ where: { email } });

    if (!user) {
      return res.status(400).json({ error: MESSAGES.invalidEmailPassword });
    }

    if (!user.password) {
      return res.status(400).json({ error: MESSAGES.passwordNotSet });
    }

    const isMatch = await bcrypt.compare(password, user.password);

    if (!isMatch) {
      return res.status(400).json({ error: MESSAGES.invalidEmailPassword });
    }

    const twoFactor = await db.TwoFactor.findOne({ where: { profileId: user.id } });
    if (!twoFactor) {
      await db.TwoFactor.create({
        profileId: user.id,
        twoFactorSecret: "",
        twoFactorEnabled: false,
      });
    }
    if (twoFactor && twoFactor.twoFactorEnabled) {
      res.status(200).json({ twoFactorRequired: true, userId: user.id, message: MESSAGES.twoFactorRequired });
    } else {
      const token = jwt.sign({ id: user.id }, process.env.JWT_SECRET, { expiresIn: "1h" });
      const userData = user.toJSON();
      delete userData.password;
      res.status(200).json({ token, user: userData, message: MESSAGES.loginSuccess });
    }
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Google authentication callback
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.googleCallback = (req, res) => {
  const token = jwt.sign({ id: req.user.id }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });
  res.json({ token, user: req.user, message: MESSAGES.googleAuthSuccess });
};
