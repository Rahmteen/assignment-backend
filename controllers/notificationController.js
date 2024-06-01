const db = require('../models');

// Response Messages
const MESSAGES = {
  notificationSettingsNotFound: "Notification settings not found",
  notificationsEnabled: "Notifications enabled",
  notificationsDisabled: "Notifications disabled",
  serverError: "Internal server error",
};

/**
 * Enable notifications for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.enableNotifications = async (req, res) => {
  const { webToken } = req.body;

  try {
    const notification = await db.Notification.findOne({ where: { profileId: req.user.id } });

    if (!notification) {
      return res.status(404).json({ error: MESSAGES.notificationSettingsNotFound });
    }

    await notification.update({
      webToken: webToken || notification.webToken,
      receiveNotifications: true,
    });

    res.status(200).json({ message: MESSAGES.notificationsEnabled, notification });
  } catch (error) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Disable notifications for a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.disableNotifications = async (req, res) => {
  try {
    const notification = await db.Notification.findOne({ where: { profileId: req.user.id } });

    if (!notification) {
      return res.status(404).json({ error: MESSAGES.notificationSettingsNotFound });
    }

    await notification.update({
      receiveNotifications: false,
    });

    res.status(200).json({ message: MESSAGES.notificationsDisabled, notification });
  } catch (error) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};
