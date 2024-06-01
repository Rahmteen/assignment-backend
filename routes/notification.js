const express = require("express");
const router = express.Router();
const passport = require("passport");
const notificationController = require("../controllers/notificationController");

/**
 * @swagger
 * /notification/enable:
 *   post:
 *     summary: Enable notifications for the authenticated user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               webToken:
 *                 type: string
 *                 description: The web token for push notifications
 *     responses:
 *       200:
 *         description: Notifications enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications enabled
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/enable", passport.authenticate("jwt", { session: false }), notificationController.enableNotifications);

/**
 * @swagger
 * /notification/disable:
 *   post:
 *     summary: Disable notifications for the authenticated user
 *     tags: [Notification]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Notifications disabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Notifications disabled
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post("/disable", passport.authenticate("jwt", { session: false }), notificationController.disableNotifications);

module.exports = router;
