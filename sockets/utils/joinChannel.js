const jwt = require("jsonwebtoken");
const db = require("../../models");

// Response Messages
const MESSAGES = {
  joinedChannel: "has joined the channel",
  authenticationError: "User not authenticated",
  invalidTokenError: "Invalid token",
};

/**
 * Handles joining a channel.
 * @param {Object} ws - WebSocket connection instance.
 * @param {Object} data - Data sent by the client.
 */

const joinChannel = async (ws, data) => {
  try {
    const { channelId, token } = data;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.Profile.findByPk(decoded.id);

    if (user) {
      ws.channelId = channelId;
      ws.user = user;
      ws.send(JSON.stringify({ message: `${user.username} ${MESSAGES.joinedChannel}` }));
    } else {
      ws.send(JSON.stringify({ error: MESSAGES.authenticationError }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ error: MESSAGES.invalidTokenError }));
  }
};

module.exports = joinChannel;
