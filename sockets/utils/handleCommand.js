const jwt = require("jsonwebtoken");
const db = require("../../models");
const handleCommandLogic = require("./handleCommandLogic");

// Response Messages
const MESSAGES = {
  authenticationError: "User not authenticated",
  invalidTokenError: "Invalid token",
};

/**
 * Logic for handling chat commands.
 * @param {Object} ws - WebSocket connection instance.
 * @param {string} channelId - The ID of the channel.
 * @param {string} command - The command to execute.
 * @param {Object} user - The user executing the command.
 */

const handleCommand = async (ws, data) => {
  try {
    const { channelId, command, token } = data;
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await db.Profile.findByPk(decoded.id);

    if (user) {
      await handleCommandLogic(ws, channelId, command, user);
    } else {
      ws.send(JSON.stringify({ error: MESSAGES.authenticationError }));
    }
  } catch (error) {
    ws.send(JSON.stringify({ error: MESSAGES.invalidTokenError }));
  }
};

module.exports = handleCommand;
