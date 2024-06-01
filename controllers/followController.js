const db = require("../models");

// Response Messages
const MESSAGES = {
  cannotFollowSelf: "You cannot follow yourself",
  alreadyFollowing: "You are already following this user",
  followSuccess: "Successfully followed the user",
  notFollowing: "You are not following this user",
  unfollowSuccess: "Successfully unfollowed the user",
  serverError: "Internal server error",
};

/**
 * Follow a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.follow = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  try {
    // Check if the user is trying to follow themselves
    if (followerId === followingId) {
      return res.status(400).json({ error: MESSAGES.cannotFollowSelf });
    }

    // Check if the follow relationship already exists
    const existingFollow = await db.Follow.findOne({
      where: { followerId, followingId },
    });

    if (existingFollow) {
      return res.status(400).json({ error: MESSAGES.alreadyFollowing });
    }

    // Create the follow relationship
    await db.Follow.create({ followerId, followingId });

    res.status(200).json({ message: MESSAGES.followSuccess });
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Unfollow a user
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.unfollow = async (req, res) => {
  const followerId = req.user.id;
  const followingId = req.params.id;

  try {
    // Check if the follow relationship exists
    const existingFollow = await db.Follow.findOne({
      where: { followerId, followingId },
    });

    if (!existingFollow) {
      return res.status(400).json({ error: MESSAGES.notFollowing });
    }

    // Delete the follow relationship
    await db.Follow.destroy({ where: { followerId, followingId } });

    res.status(200).json({ message: MESSAGES.unfollowSuccess });
  } catch (err) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};
