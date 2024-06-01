require("dotenv").config();

const passport = require("passport");
const GoogleStrategy = require("passport-google-oauth20").Strategy;
const { Strategy: JwtStrategy, ExtractJwt } = require("passport-jwt");
const db = require("../models");

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID || "GOOGLE_CLIENT_ID",
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || "GOOGLE_CLIENT_SECRET",
      callbackURL: process.env.GOOGLE_CALLBACK_URL || "GOOGLE_CALLBACK_URL",
    },
    async (token, tokenSecret, profile, done) => {
      try {
        let user = await db.Profile.findOne({ where: { email: profile.emails[0].value } });
        if (!user) {
          user = await db.Profile.create({
            fullName: profile.displayName,
            username: profile.emails[0].value.split("@")[0],
            email: profile.emails[0].value,
            avatar: profile.photos[0].value,
            active: true,
          });
        }

        await db.Notification.create({
          profileId: user.id,
          webToken: null,
          email: profile.emails[0].value,
          receiveNotifications: false,
        });

        await db.TwoFactor.create({
          profileId: user.id,
          twoFactorSecret: "",
          twoFactorEnabled: false,
        });

        return done(null, user);
      } catch (error) {
        console.error(error);
        return done(error, false);
      }
    }
  )
);

passport.use(
  new JwtStrategy(
    {
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: process.env.JWT_SECRET,
    },
    async (jwtPayload, done) => {
      try {
        const user = await db.Profile.findByPk(jwtPayload.id);
        if (user) {
          return done(null, user);
        } else {
          return done(null, false);
        }
      } catch (error) {
        return done(error, false);
      }
    }
  )
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await db.Profile.findByPk(id);
    done(null, user);
  } catch (error) {
    done(error, false);
  }
});

module.exports = passport;
