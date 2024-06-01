const WebSocket = require("ws");

/**
 * Broadcasts a message to all clients in the channel.
 * @param {string} channelId - The ID of the channel.
 * @param {string} message - The message to broadcast.
 */

const broadcast = (channelId, message) => {
  wss.clients.forEach((client) => {
    if (client.readyState === WebSocket.OPEN && client.channelId === channelId) {
      client.send(JSON.stringify({ message }));
    }
  });
};

module.exports = broadcast;
