const express = require('express');
const passport = require('passport');
const router = express.Router();
const followController = require('../controllers/followController');

/**
 * @swagger
 * /follow/{id}:
 *   post:
 *     summary: Follow a profile
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the profile to follow
 *     responses:
 *       200:
 *         description: Followed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Followed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/follow/:id', passport.authenticate('jwt', { session: false }), followController.follow);

/**
 * @swagger
 * /unfollow/{id}:
 *   post:
 *     summary: Unfollow a profile
 *     tags: [Follow]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The ID of the profile to unfollow
 *     responses:
 *       200:
 *         description: Unfollowed successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: Unfollowed successfully
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Internal server error
 */
router.post('/unfollow/:id', passport.authenticate('jwt', { session: false }), followController.unfollow);

module.exports = router;
