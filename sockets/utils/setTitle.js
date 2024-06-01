const db = require("../../models");

// Response Messages
const MESSAGES = {
  unauthorizedError: "You are not authorized to set the title",
  successMessage: (title) => `The channel title has been updated to ${title}`,
};

/**
 * Set the title of a channel.
 * @param {Object} ws - WebSocket connection instance.
 * @param {string} channelId - The ID of the channel.
 * @param {Object} user - The user executing the command.
 * @param {string} title - The new title.
 */
const setTitle = async (ws, channelId, user, title) => {
  const channelRole = await db.ChannelRole.findOne({
    where: { profileId: user.id, channelId: channelId },
  });
  if (channelRole && (channelRole.role === "HOST" || channelRole.role === "SUPERADMIN")) {
    await db.Channel.update({ name: title }, { where: { id: channelId } });
    ws.send(JSON.stringify({ message: MESSAGES.successMessage(title) }));
  } else {
    ws.send(JSON.stringify({ error: MESSAGES.unauthorizedError }));
  }
};

module.exports = setTitle;
