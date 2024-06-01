const db = require("../models");
const bcrypt = require("bcryptjs");

// Response Messages
const MESSAGES = {
  userNotFound: "User not found",
  profileNotFound: "Profile not found",
  emailInUse: "Email already in use",
  usernameInUse: "Username already in use",
  profileUpdated: "Profile updated successfully",
  serverError: "Internal server error",
};

/**
 * Get a public profile by ID
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getPublicProfile = async (req, res) => {
  const { id } = req.params;

  try {
    const user = await db.Profile.findOne({
      where: { id },
      attributes: ["id", "username", "avatar", "createdAt"],
    });

    if (!user) {
      return res.status(404).json({ error: MESSAGES.userNotFound });
    }

    res.status(200).json(user);
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Get the authenticated user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.getProfile = async (req, res) => {
  try {
    const profile = await db.Profile.findByPk(req.user.id, {
      attributes: ['id', 'fullName', 'username', 'email', 'avatar', 'createdAt', 'updatedAt']
    });

    if (!profile) {
      return res.status(404).json({ error: MESSAGES.profileNotFound });
    }

    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Update the authenticated user's profile
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.updateProfile = async (req, res) => {
  const { fullName, username, email, avatar, password } = req.body;
  const userId = req.user.id;

  try {
    const user = await db.Profile.findByPk(userId);

    if (!user) {
      return res.status(404).json({ error: MESSAGES.userNotFound });
    }

    if (email && email !== user.email) {
      const emailExists = await db.Profile.findOne({ where: { email } });
      if (emailExists) {
        return res.status(400).json({ error: MESSAGES.emailInUse });
      }
    }

    if (username && username !== user.username) {
      const usernameExists = await db.Profile.findOne({ where: { username } });
      if (usernameExists) {
        return res.status(400).json({ error: MESSAGES.usernameInUse });
      }
    }

    const updatedData = {
      fullName: fullName || user.fullName,
      username: username || user.username,
      email: email || user.email,
      avatar: avatar || user.avatar
    };

    if (password) {
      updatedData.password = await bcrypt.hash(password, 10);
    }

    if (email && email !== user.email) {
      const notification = await db.Notification.findOne({ where: { profileId: userId } });
      if (notification) {
        await notification.update({ email });
      }
    }

    await user.update(updatedData);

    res.status(200).json({ message: MESSAGES.profileUpdated, user });
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};
