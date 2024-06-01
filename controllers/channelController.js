require("dotenv").config();

const db = require("../models");
const { sendEmailNotification } = require("../services/notification");
const { setupWebSocketServer, getWebSocketServer } = require("../sockets/chat");

const MESSAGES = {
  channelCreated: "Channel created successfully",
  streamStarted: "Stream started",
  streamEnded: "Stream ended",
  channelNotFound: "Channel not found",
  notAuthorized: "You are not authorized to perform this action",
  serverError: "Internal server error",
};

/**
 * Create a new channel and assign the user as host
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.createChannel = async (req, res) => {
  try {
    const { name, description } = req.body;

    const channel = await db.Channel.create({
      name,
      description,
      userId: req.user.id,
    });

    await db.ChannelRole.create({
      role: "HOST",
      userId: req.user.id,
      channelId: channel.id,
    });

    res.status(201).json({ message: MESSAGES.channelCreated, channel });
  } catch (error) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * Start a stream, notify followers and start websocket connection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.startStream = async (req, res) => {
  try {
    const { channelId } = req.body;
    const channel = await db.Channel.findByPk(channelId);

    if (!channel) {
      return res.status(404).json({ error: MESSAGES.channelNotFound });
    }

    if (channel.userId !== req.user.id) {
      return res.status(403).json({ error: MESSAGES.notAuthorized });
    }

    channel.live = true;
    await channel.save();

    const server = req.app.get("server");
    const wss = getWebSocketServer();
    if (!wss) {
      setupWebSocketServer(server);
    }

    // Notify followers WIP
    const followers = await db.Follow.findAll({ where: { followingId: req.user.id } });
    const notificationPromises = followers.map(async (follower) => {
      const notification = await db.Notification.findOne({ where: { profileId: follower.followerId } });
      if (notification && notification.receiveNotifications) {
        sendEmailNotification(notification.email, {
          subject: "Stream started",
          text: `Your favorite streamer ${req.user.fullName} has started a stream!`,
        });
      }
    });
    await Promise.all(notificationPromises);

    res.status(200).json({ message: MESSAGES.streamStarted, channel });
  } catch (error) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};

/**
 * End a stream for a channel and close websocket connection
 * @param {Object} req - Express request object
 * @param {Object} res - Express response object
 */
exports.endStream = async (req, res) => {
  try {
    const { channelId } = req.body;
    const channel = await db.Channel.findByPk(channelId);

    if (!channel) {
      return res.status(404).json({ error: MESSAGES.channelNotFound });
    }

    if (channel.userId !== req.user.id) {
      return res.status(403).json({ error: MESSAGES.notAuthorized });
    }

    channel.live = false;
    await channel.save();

    const wss = getWebSocketServer();
    if (wss) {
      wss.clients.forEach((client) => {
        if (client.channelId === channelId && client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ message: MESSAGES.streamEnded }));
          client.close();
        }
      });
    }

    res.status(200).json({ message: MESSAGES.streamEnded, channel });
  } catch (error) {
    res.status(500).json({ error: MESSAGES.serverError });
  }
};
