const setAdmin = require("./banUser");
const unsetAdmin = require("./unsetAdmin");
const muteUser = require("./muteUser");
const unmuteUser = require("./unmuteUser");
const banUser = require("./banUser");
const unbanUser = require("./unbanUser");
const suspendChannel = require("./suspendChannel");
const setTitle = require("./setTitle");
const setDescription = require("./setDescription");

// Response Messages
const MESSAGES = {
  userNotFoundError: (username) => `User ${username} not found`,
  unknownCommandError: "Unknown command",
};

/**
 * Logic for handling chat commands.
 * @param {Object} ws - WebSocket connection instance.
 * @param {string} channelId - The ID of the channel.
 * @param {string} command - The command to execute.
 * @param {Object} user - The user executing the command.
 */
const handleCommandLogic = async (ws, channelId, command, user) => {
  const [cmd, ...args] = command.split(" ");
  const targetUsername = args[0]?.replace("@", "");
  const targetUser = await db.Profile.findOne({ where: { username: targetUsername } });

  if (!targetUser) {
    ws.send(JSON.stringify({ error: MESSAGES.userNotFoundError(targetUsername) }));
    return;
  }

  switch (cmd) {
    case "/set":
      if (args[0] === "admin") {
        await setAdmin(ws, channelId, user, targetUser);
      } else if (args[0] === "title") {
        await setTitle(ws, channelId, user, args.slice(1).join(" "));
      } else if (args[0] === "description") {
        await setDescription(ws, channelId, user, args.slice(1).join(" "));
      }
      break;
    case "/unset":
      if (args[0] === "admin") {
        await unsetAdmin(ws, channelId, user, targetUser);
      }
      break;
    case "/mute":
      await muteUser(ws, channelId, user, targetUser);
      break;
    case "/unmute":
      await unmuteUser(ws, channelId, user, targetUser);
      break;
    case "/ban":
      await banUser(ws, channelId, user, targetUser);
      break;
    case "/unban":
      await unbanUser(ws, channelId, user, targetUser);
      break;
    case "/suspend":
      await suspendChannel(ws, channelId, user);
      break;
    default:
      ws.send(JSON.stringify({ error: MESSAGES.unknownCommandError }));
  }
};

module.exports = handleCommandLogic;
