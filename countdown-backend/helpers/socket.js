const appConst = require("./constants");
const Countdown = require("../models/CountdownModel");
const User = require("../models/UserModel");
// countdown duration - minutes
var duration = 60;
// switch period - second
var period = 1;
// max win count
var maxWin = 10;
// live users
var users = [];
// live requests
var requests = [];
// current time - second
var current = 0;
// timer
var timer = {};
// elapsed timeer
var elapsedTimer = {};
var checkTimer = {};
// winner inde
var winnerIndex = 0;
// time elapsed from end countdown : second
var timeElapsed = 0;

/**
 * start countdown timer
 * @param {Object} config
 * @param {Array} liveUsers
 * @param {Array} liveRequests
 * @param {Object} socket
 */
exports.startCountdown = (config, liveRequests, liveUsers, socket) => {
	var self = this;
	// check time elapsed since the last countdown finished
	if (timeElapsed < config.winnerShowTime * 60) {
		setTimeout(() => {
			let timeLeft = config.winnerShowTime * 60 - timeElapsed;
			socket.emit(appConst.constants.socketEvents.PENDING_COUNTDOWN, timeLeft);
			timeElapsed++;
			self.startCountdown(config, liveRequests, liveUsers, socket);
		}, 1000);
	} else {
		// clear elapsed timer
		clearInterval(elapsedTimer);
		clearInterval(checkTimer);
		timeElapsed = 0;
		socket.emit(appConst.constants.socketEvents.PENDING_COUNTDOWN, 0);

		// start countdown
		socket.emit(appConst.constants.socketEvents.START_COUNTDOWN);

		duration = config.duration;
		period = config.switches;
		users.splice(0);
		users.push(...liveUsers);
		requests.splice(0);
		requests.push(...liveRequests);
		timer = setInterval(() => {
			winnerIndex = Math.floor(Math.random() * liveRequests.length);
			socket.emit(appConst.constants.socketEvents.SWITCH_WINNER, {
				user: users[winnerIndex],
				request: requests[winnerIndex],
				time: duration * 60 - current
			});
			current += Number(period);
			// stop countdown
			if (duration * 60 < current) {
				self.endCountdown(socket);
			}
		}, period * 1000);
	}
};

/**
 * end countdown
 * @param {Object} socket
 */
exports.endCountdown = socket => {
	// If the final winner wins more than max win count,
	// choose another one
	if (users[winnerIndex].wins >= maxWin) {
		let newIndex = users.findIndex(item => item.wins < maxWin);
		// not everybody wins more than maxWin
		if (newIndex !== -1) {
			winnerIndex = newIndex;
		}
	}

	socket.emit(appConst.constants.socketEvents.END_COUNTDOW, {
		user: users[winnerIndex],
		request: requests[winnerIndex],
		time: 0
	});

	let wins = 0;
	wins = Number(users[winnerIndex].wins);

	// set winner
	Countdown.findByIdAndUpdate(
		requests[winnerIndex].countdown,
		{
			winner: users[winnerIndex]._id,
			request: requests[winnerIndex]._id,
			name: `IWANTII-${users[winnerIndex].name}`
		},
		function(err) {
			return err;
		}
	);
	// update win count
	User.findByIdAndUpdate(
		users[winnerIndex]._id,
		{ wins: Number(wins + 1) },
		function(err) {
			if (err) {
				return err;
			}
		}
	);
	// set all user not live
	User.find({ isLive: true }, function(err, users) {
		if (err) {
			console.log(err);
		}
		users.forEach(user => {
			User.findByIdAndUpdate(user._id, { isLive: false }, function() {});
		});
	});

	winnerIndex = 0;
	current = 0;
	clearInterval(timer);

	// time elapsed
	elapsedTimer = setInterval(() => {
		timeElapsed++;
	}, 1000);
};

/**
 * new request has been sent
 */
exports.newRequest = socket => {
	socket.emit(`${appConst.constants.socketEvents.NEW_REQUEST}`);
};
