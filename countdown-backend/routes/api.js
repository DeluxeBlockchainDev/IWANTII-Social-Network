var express = require("express");
var authRouter = require("./auth");
var userRouter = require("./user");
var requestRouter = require("./request");
var countdownRouter = require("./countdown");
var settingsRouter = require("./settings");
var statisticsRouter = require("./statistics");

var app = express();
// socket server
const socketServer = require("socket.io")({
	cors: {
		origin: "*"
	}
});
const io = socketServer.listen(process.env.SOCKET_PORT);
console.log(`Socket server running on port ${process.env.SOCKET_PORT}`);

// Assign socket object to every request
app.use(function(req, res, next) {
	req.io = io;
	next();
});

app.use("/auth/", authRouter);
app.use("/users", userRouter);
app.use("/requests", requestRouter);
app.use("/countdowns", countdownRouter);
app.use("/settings", settingsRouter);
app.use("/statistics", statisticsRouter);

module.exports = app;
