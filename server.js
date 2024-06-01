require("dotenv").config();

const express = require("express");
const session = require("express-session");
const passport = require("./config/passport");
const db = require("./models");
const http = require("http");
const app = express();
const server = http.createServer(app);

app.set("server", server);
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

/**
 * Session middleware configuration.
 * @name sessionMiddleware
 * @memberof server
 * @param {string} secret - Secret for session encryption from environment variables.
 * @param {boolean} resave - Forces session to be saved even when unmodified.
 * @param {boolean} saveUninitialized - Forces a session that is "uninitialized" to be saved.
 */

app.use(
  session({
    secret: process.env.EXPRESS_SESSION_SECRET || '#',
    resave: false,
    saveUninitialized: false,
  })
);

app.use(passport.initialize());
app.use(passport.session());

/**
 * Import routes and set up the API endpoint.
 * @name apiRoutes
 * @memberof server
 */

const routes = require("./routes");
app.use("/api", routes);

/**
 * Swagger setup for API documentation.
 * @name swaggerSetup
 * @memberof server
 */

const { swaggerUi, swaggerSpec } = require("./swagger");
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerSpec));

/**
 * Sync database and start the server.
 * @name startServer
 * @memberof server
 */

const PORT = process.env.PORT || 3000;

db.sequelize.sync().then(() => {
  server.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
  });
});
