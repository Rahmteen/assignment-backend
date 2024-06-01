const db = require("../../models");

// Response Messages
const MESSAGES = {
  unauthorizedError: "You are not authorized to set admin",
  successMessage: (username) => `${username} is now an ADMIN`,
};

/**
 * Set a user as admin.
 * @param {Object} ws - WebSocket connection instance.
 * @param {string} channelId - The ID of the channel.
 * @param {Object} user - The user executing the command.
 * @param {Object} targetUser - The user to be set as admin.
 */
const setAdmin = async (ws, channelId, user, targetUser) => {
  const channelRole = await db.ChannelRole.findOne({
    where: { profileId: user.id, channelId: channelId },
  });
  if (channelRole && (channelRole.role === "HOST" || channelRole.role === "SUPERADMIN")) {
    await db.ChannelRole.update({ role: "ADMIN" }, { where: { profileId: targetUser.id, channelId: channelId } });
    ws.send(JSON.stringify({ message: MESSAGES.successMessage(targetUser.username) }));
  } else {
    ws.send(JSON.stringify({ error: MESSAGES.unauthorizedError }));
  }
};

module.exports = setAdmin;
