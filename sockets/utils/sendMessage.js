const jwt = require("jsonwebtoken");
const db = require("../../models");
const broadcast = require("./broadcast");

// Response Messages
const MESSAGES = {
  bannedMessage: "You are banned from this channel",
  mutedMessage: "You are muted in this channel",
  authenicationError: "User not authenticated",
  invalidTokenError: "Invalid token",
};

/**
 * Handles sending a message.
 * @param {Object} ws - WebSocket connection instance.
 * @param {Object} data - Data sent by the client.
 */

const sendMessage = async (ws, data) => {
  try {
    const { channelId, message, token } = data;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.Profile.findByPk(decoded.id);

    if (user) {
      const channelRole = await db.ChannelRole.findOne({
        where: { profileId: user.id, channelId: channelId },
      });

      if (channelRole.role === "BANNED") {
        ws.send(JSON.stringify({ error: MESSAGES.bannedMessage }));
        return;
      }
      if (channelRole.role === "MUTED") {
        ws.send(JSON.stringify({ error: MESSAGES.mutedMessage }));
        return;
      }

      await db.Chat.create({
        message,
        profileId: user.id,
        channelId: channelId,
      });

      broadcast(channelId, `${user.username}: ${message}`);
    } else {
      ws.send(JSON.stringify({ error: MESSAGES.authenicationError }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ error: MESSAGES.invalidTokenError }));
  }
};

module.exports = sendMessage;
