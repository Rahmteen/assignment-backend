require("dotenv").config();

const db = require("../models");
const speakeasy = require("speakeasy");
const qrcode = require("qrcode");
const jwt = require("jsonwebtoken");

// Response Messages
const MESSAGES = {
  userNotFound: "User not found",
  qrCodeGenerationFailed: "Failed to generate QR code",
  twoFactorEnabled: "2FA enabled",
  twoFactorNotEnabled: "2FA not enabled for this user",
  verified: "verified",
  invalidToken: "Invalid 2FA token",
  serverError: "Internal server error",
};

/**
 * Enable Two-Factor Authentication (2FA) for the authenticated user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.enable2FA = async (req, res) => {
  try {
    const user = await db.Profile.findByPk(req.user.id);
    if (!user) {
      return res.status(404).json({ error: MESSAGES.userNotFound });
    }

    const secret = speakeasy.generateSecret({ name: "Stonks App" });

    await db.TwoFactor.update(
      { twoFactorSecret: secret.base32, twoFactorEnabled: true },
      { where: { profileId: user.id } }
    );

    qrcode.toDataURL(secret.otpauth_url, (err, data_url) => {
      if (err) {
        return res.status(500).json({ error: MESSAGES.qrCodeGenerationFailed });
      }

      res.status(200).json({ message: MESSAGES.twoFactorEnabled, qrCode: data_url, secret: secret.base32 });
    });
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Verify the 2FA token for the given user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.verify2FA = async (req, res) => {
  const { userId, token } = req.body;

  try {
    const twoFactor = await db.TwoFactor.findOne({ where: { profileId: userId } });

    if (!twoFactor) {
      return res.status(404).json({ error: MESSAGES.twoFactorNotEnabled });
    }

    const verified = speakeasy.totp.verify({
      secret: twoFactor.twoFactorSecret,
      encoding: "base32",
      token: token,
    });

    if (verified) {
      const authToken = jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "1h" });
      res.status(200).json({ message: MESSAGES.verified, token: authToken });
    } else {
      res.status(400).json({ error: MESSAGES.invalidToken });
    }
  } catch (err) {
    res.status (500).json({ error: MESSAGES.serverError });
  }
};
