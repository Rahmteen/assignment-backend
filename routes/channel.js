const express = require('express');
const router = express.Router();
const passport = require('passport');
const channelController = require('../controllers/channelController');

/**
 * @swagger
 * /channel/create:
 *   post:
 *     summary: Create a new channel
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *                 example: My Channel
 *               description:
 *                 type: string
 *                 example: A description of my channel
 *     responses:
 *       201:
 *         description: Channel created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Channel created successfully
 *                 channel:
 *                   type: object
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/create', passport.authenticate('jwt', { session: false }), channelController.createChannel);

/**
 * @swagger
 * /channel/stream/start:
 *   post:
 *     summary: Start a live stream
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 example: d5e2ec67-c7e7-432d-8459-16aee79a1187
 *     responses:
 *       200:
 *         description: Stream started successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stream started successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
router.post('/stream/start', passport.authenticate('jwt', { session: false }), channelController.startStream);

/**
 * @swagger
 * /channel/stream/end:
 *   post:
 *     summary: End a live stream
 *     tags: [Channel]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               channelId:
 *                 type: string
 *                 example: d5e2ec67-c7e7-432d-8459-16aee79a1187
 *     responses:
 *       200:
 *         description: Stream ended successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Stream ended successfully
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: Channel not found
 *       500:
 *         description: Internal server error
 */
router.post('/stream/end', passport.authenticate('jwt', { session: false }), channelController.endStream);

module.exports = router;
