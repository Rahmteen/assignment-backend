const WebSocket = require("ws");
const joinChannel = require("./utils/joinChannel");
const sendMessage = require("./utils/sendMessage");
const handleCommand = require("./utils/handleCommand");
const broadcast = require("./utils/broadcast");
let wss;

// Response Messages
const MESSAGES = {
  unknownAction: "Unknown action",
  invalidMessageFormat: "Invalid message format",
  clientConnected: "New client connected",
  clientDisconnected: "Client disconnected",
};

/**
 * Sets up the WebSocket server.
 * @param {Object} server - The HTTP server instance.
 */
const setupWebSocketServer = (server) => {
  wss = new WebSocket.Server({ noServer: true });

  wss.on("connection", (ws) => {
    console.log(MESSAGES.clientConnected);

    ws.on("message", async (message) => {
      try {
        const data = JSON.parse(message);

        switch (data.action) {
          case "joinChannel":
            await joinChannel(ws, data);
            break;
          case "sendMessage":
            await sendMessage(ws, data, broadcast.bind(null, wss));
            break;
          case "command":
            await handleCommand(ws, data);
            break;
          default:
            ws.send(JSON.stringify({ error: MESSAGES.unknownAction }));
        }
      } catch (error) {
        ws.send(JSON.stringify({ error: MESSAGES.invalidMessageFormat }));
      }
    });

    ws.on("close", () => {
      console.log(MESSAGES.clientDisconnected);
    });
  });

  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });
};

/**
 * Gets the WebSocket server instance.
 * @returns {Object} The WebSocket server instance.
 */
const getWebSocketServer = () => wss;

module.exports = {
  setupWebSocketServer,
  getWebSocketServer,
};
