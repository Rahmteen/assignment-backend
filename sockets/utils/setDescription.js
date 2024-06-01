const db = require("../../models");

// Response Messages
const MESSAGES = {
  unauthorizedError: "You are not authorized to set the description",
  successMessage: "The channel description has been updated",
};

/**
 * Set the description of a channel.
 * @param {Object} ws - WebSocket connection instance.
 * @param {string} channelId - The ID of the channel.
 * @param {Object} user - The user executing the command.
 * @param {string} description - The new description.
 */
const setDescription = async (ws, channelId, user, description) => {
  const channelRole = await db.ChannelRole.findOne({
    where: { profileId: user.id, channelId: channelId },
  });
  if (channelRole && (channelRole.role === "HOST" || channelRole.role === "SUPERADMIN")) {
    await db.Channel.update({ description: description }, { where: { id: channelId } });
    ws.send(JSON.stringify({ message: MESSAGES.successMessage }));
  } else {
    ws.send(JSON.stringify({ error: MESSAGES.unauthorizedError }));
  }
};

module.exports = setDescription;
