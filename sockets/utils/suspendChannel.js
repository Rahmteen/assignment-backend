const db = require("../../models");

// Response Messages
const MESSAGES = {
  unauthorizedError: "You are not authorized to suspend the channel",
  successMessage: "The channel has been suspended by a SUPERADMIN",
};

/**
 * Suspend a channel.
 * @param {Object} ws - WebSocket connection instance.
 * @param {string} channelId - The ID of the channel.
 * @param {Object} user - The user executing the command.
 */
const suspendChannel = async (ws, channelId, user) => {
  const channelRole = await db.ChannelRole.findOne({
    where: { profileId: user.id, channelId: channelId },
  });
  if (channelRole && channelRole.role === "SUPERADMIN") {
    await db.Channel.update({ live: false }, { where: { id: channelId } });
    ws.send(JSON.stringify({ message: MESSAGES.successMessage }));
  } else {
    ws.send(JSON.stringify({ error: MESSAGES.unauthorizedError }));
  }
};

module.exports = suspendChannel;
