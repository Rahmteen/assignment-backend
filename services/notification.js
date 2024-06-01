require('dotenv').config();

const OneSignal = require("onesignal-node");
const nodemailer = require("nodemailer");

// Response Messages
const MESSAGES = {
  webSuccess: "Web notifications sent successfully",
  webError: "Error sending web notifications:",
  emailSuccess: "Emails sent successfully",
  emailError: "Error sending emails:",
};

// Initialize OneSignal client
const oneSignalClient = new OneSignal.Client(
  process.env.ONE_SIGNAL_APP_ID,
  process.env.ONE_SIGNAL_API_KEY
);

// Initialize nodemailer transporter
const transporter = nodemailer.createTransport({
  service: process.env.NODEMAILER_SERVICE,
  auth: {
    user: process.env.NODEMAILER_EMAIL,
    pass: process.env.NODEMAILER_PASSWORD,
  },
});

/**
 * Sends a web notification using OneSignal.
 * @param {string[]} webTokens - Array of web tokens to send notifications to.
 * @param {Object} data - Notification data.
 * @param {string} data.title - The title of the notification.
 * @param {string} data.message - The message content of the notification.
 */
exports.sendWebNotification = async (webTokens, data) => {
  try {
    const notification = {
      contents: {
        en: data.message,
      },
      include_player_ids: webTokens,
      headings: {
        en: data.title,
      },
    };

    await oneSignalClient.createNotification(notification);
    console.log(MESSAGES.webSuccess);
  } catch (error) {
    console.error(MESSAGES.webError, error);
  }
};

/**
 * Sends an email notification using nodemailer.
 * @param {string} email - The recipient's email address.
 * @param {Object} data - Email data.
 * @param {string} data.subject - The subject of the email.
 * @param {string} data.text - The text content of the email.
 */
exports.sendEmailNotification = async (email, data) => {
  try {
    const mailOptions = {
      from: process.env.NODEMAILER_EMAIL,
      to: email,
      subject: data.subject,
      text: data.text,
    };

    await transporter.sendMail(mailOptions);
    console.log(MESSAGES.emailSuccess);
  } catch (error) {
    console.error(MESSAGES.emailError, error);
  }
};
