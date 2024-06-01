const express = require("express");
const router = express.Router();
const twoFactorController = require("../controllers/twoFactorController");
const passport = require("passport");

/**
 * @swagger
 * /twoFactor/setup:
 *   post:
 *     summary: Enable Two-Factor Authentication (2FA)
 *     tags: [TwoFactor]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: 2FA enabled successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: 2FA enabled
 *                 qrCode:
 *                   type: string
 *                   format: uri
 *                 secret:
 *                   type: string
 *       401:
 *         description: Unauthorized
 *       404:
 *         description: User not found
 *       500:
 *         description: Internal server error
 */
router.post("/setup", passport.authenticate("jwt", { session: false }), twoFactorController.enable2FA);

/**
 * @swagger
 * /twoFactor/verify:
 *   post:
 *     summary: Verify Two-Factor Authentication (2FA) token
 *     tags: [TwoFactor]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               userId:
 *                 type: string
 *                 example: "user-id-example"
 *               token:
 *                 type: string
 *                 example: "123456"
 *     responses:
 *       200:
 *         description: 2FA token verified successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: verified
 *                 token:
 *                   type: string
 *                   example: "jwt-token-example"
 *       400:
 *         description: Invalid 2FA token
 *       404:
 *         description: 2FA not enabled for this user
 *       500:
 *         description: Internal server error
 */
router.post("/verify", twoFactorController.verify2FA);

module.exports = router;
