const fs = require("fs");
const path = require("path");
const dirPath = "./../models/";
const fileName = "Settings.json";
const Request = require("../models/RequestModel");
const User = require("../models/UserModel");
const socketService = require("./socket");

/**
 * Validate request and save it
 * trigger new request event and start countdown event if fulfil condition
 * @param {Object} sockets
 * @param {String} countdownId
 * @param {String} userId
 */
exports.newRequest = (sockets, countdownId) => {
	// emit socket event
	socketService.newRequest(sockets);

	// start countdown
	let rawdata = fs.readFileSync(
		path.join(__dirname, dirPath, fileName),
		"utf8"
	);
	let setting = JSON.parse(rawdata).config;

	// find all users on the countdown
	Request.find({ countdown: countdownId }, async function(err, requests) {
		let users = [];
		for (let i = 0; i < requests.length; i++) {
			let user = await User.findById(requests[i].user);
			if (user) {
				users.push(user);
			}
		}
		// if count reaches to min number to start
		if (requests.length >= Number(setting.minUsers)) {
			socketService.startCountdown(setting, requests, users, sockets);
		}
	});
};

/**
 * Check request validation
 * @param {Object} request
 */
exports.validateRequest = async request => {
	// same ip check
	let ipCheck = await checkSameIp(request.countdown, request.ip);
	if (ipCheck.err) {
		return ipCheck;
	}
	// user activation check
	let userCheck = await isActive(request.user);
	if (userCheck.err) {
		return userCheck;
	}
	// same request count check
	let sameReqeustCheck = await checkSameContents(request.user, request.text);
	if (sameReqeustCheck.err) {
		return sameReqeustCheck;
	}
	// same link count check
	let sameLinkCheck = await checkSameLinks(request.user, request.text);
	if (sameLinkCheck.err) {
		return sameLinkCheck;
	}
};

/**
 * check same ip existance
 * @param {String} countdownId
 * @param {String} requestIP
 */
const checkSameIp = async (countdownId, requestIP) => {
	let requests = await Request.find({ countdown: countdownId, ip: requestIP });
	if (requests.length > 0) {
		return {
			err: true,
			message: "Your IP address is in use by another one."
		};
	}
	return {
		err: false,
		message: ""
	};
};

/**
 * Check whether the user is blocked or not
 * @param {String} userId
 */
const isActive = async userId => {
	let user = await User.findById(userId);
	if (user && user.active) {
		return {
			err: false,
			message: ""
		};
	}
	return {
		err: true,
		message: "You are blocked to send reqeust."
	};
};

/**
 * check same request count
 * and update sameRequest field of User
 * @param {String} userId
 * @param {String} text
 */
const checkSameContents = async (userId, text) => {
	let myRequests = await Request.find({ user: userId, text: text });
	let rawdata = fs.readFileSync(
		path.join(__dirname, dirPath, fileName),
		"utf8"
	);
	let setting = JSON.parse(rawdata).config;
	if (myRequests.length <= setting.sameReqeust) {
		let sameContentsCount = myRequests.length + 1;
		await User.findByIdAndUpdate(userId, {
			sameRequest: sameContentsCount,
			request: text
		});
		return {
			err: false,
			message: ""
		};
	}
	return {
		err: true,
		message: `You are not allowed to  send same reqeusts more than ${
			setting.sameReqeust
		} times.`
	};
};

/**
 * check same link counts
 * update sameLinks count in User
 * @param {String} userId
 * @param {String} text
 */
const checkSameLinks = async (userId, text) => {
	let myRequests = await Request.find({ user: userId });
	let rawdata = fs.readFileSync(
		path.join(__dirname, dirPath, fileName),
		"utf8"
	);
	let setting = JSON.parse(rawdata).config;
	let links = text.match(/\bhttps?:\/\/\S+/gi);
	// if links are existed in request
	if (links) {
		let countArr = [];
		for (let i = 0; i < links.length; i++) {
			let count = 0;
			for (let j = 0; j < myRequests.length; j++) {
				if (myRequests[j].text.indexOf(links[i]) !== -1) {
					count++;
				}
			}
			countArr.push({ count: count, link: links[i] });
		}
		let maxLink = countArr
			.sort(function(a, b) {
				return b.count - a.count;
			})
			.pop();
		if (maxLink.count <= setting.sameLink) {
			await User.findByIdAndUpdate(userId, {
				sameLinks: Number(maxLink.count + 1),
				link: maxLink.link
			});
			return {
				err: false,
				message: ""
			};
		}
		return {
			err: true,
			message: `You are not allowed to send same links more than ${
				setting.sameLink
			} times.`
		};
	}
	// if no links
	return {
		err: false,
		message: ""
	};
};
