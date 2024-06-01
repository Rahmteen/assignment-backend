const express = require("express");
const router = express.Router();
const authRoutes = require("./auth");
const profileRoutes = require("./profile");
const channelRoutes = require("./channel");
const twoFactorRoutes = require("./twoFactor");
const notificationRoutes = require("./notification");
const followRoutes = require("./follow");

router.use("/auth", authRoutes);
router.use("/profile", profileRoutes);
router.use("/channel", channelRoutes);
router.use("/2fa", twoFactorRoutes);
router.use("/notification", notificationRoutes);
router.use("/follow", followRoutes);


router.get("/", (req, res) => {
  res.send("Welcome to Stonks Backend API");
});

module.exports = router;
