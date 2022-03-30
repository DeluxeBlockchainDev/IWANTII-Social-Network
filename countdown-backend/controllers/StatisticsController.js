const User = require("../models/UserModel");
const Countdown = require("../models/CountdownModel");
const CommentOnUsers = require("../models/comments/CommentOnUserModel");
const CommentOnRequests = require("../models/comments/CommentOnRequestModel");
const CommentOnCountdowns = require("../models/comments/CommentOnCountdownModel");
const Likes = require("../models/LikesModel");
const Dislikes = require("../models/DislikesModel");
var mongoose = require("mongoose");
const moment = require("moment");
mongoose.set("useFindAndModify", false);

/**
 * Get number of users by created date
 * @param {String} start
 * @param {String} end
 * @returns {Number}
 */
exports.GetUsersCount = [
	function(req, res) {
		// statistics by date range
		if (req.query.start && req.query.end) {
			User.find(
				{
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				},
				function(err, users) {
					if (err) {
						return res.status(500).json(err);
					}
					return res.status(200).json(users.length);
				}
			);
		} else {
			User.find({}, function(err, users) {
				if (err) {
					return res.status(500).json(err);
				}
				return res.status(200).json(users.length);
			});
		}
	}
];

/**
 * Get number of countdowns by created date
 * @param {String} start
 * @param {String} end
 * @returns {Number}
 */
exports.GetCountdownsCount = [
	function(req, res) {
		// statistics by date range
		if (req.query.start && req.query.end) {
			Countdown.find(
				{
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				},
				function(err, users) {
					if (err) {
						return res.status(500).json(err);
					}
					return res.status(200).json(users.length);
				}
			);
		} else {
			Countdown.find({}, function(err, users) {
				if (err) {
					return res.status(500).json(err);
				}
				return res.status(200).json(users.length);
			});
		}
	}
];

/**
 * Get number of comments by created date
 * @param {String} start
 * @param {String} end
 * @returns {Number}
 */
exports.GetCommentsCount = [
	async function(req, res) {
		let countdowns = [];
		let requests = [];
		let users = [];
		// statistics by date range
		try {
			if (req.query.start && req.query.end) {
				countdowns = await CommentOnCountdowns.find({
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				});
				users = await CommentOnUsers.find({
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				});
				requests = await CommentOnRequests.find({
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				});
				return res
					.status(200)
					.json(users.length + requests.length + countdowns.length);
			} else {
				countdowns = await CommentOnCountdowns.find({});
				users = await CommentOnUsers.find({});
				requests = await CommentOnRequests.find({});
				return res
					.status(200)
					.json(users.length + requests.length + countdowns.length);
			}
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Get number of likes by created date
 * @param {String} start
 * @param {String} end
 * @returns {Number}
 */
exports.GetLikesCount = [
	function(req, res) {
		// statistics by date range
		if (req.query.start && req.query.end) {
			Likes.find(
				{
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				},
				function(err, users) {
					if (err) {
						return res.status(500).json(err);
					}
					return res.status(200).json(users.length);
				}
			);
		} else {
			Likes.find({}, function(err, users) {
				if (err) {
					return res.status(500).json(err);
				}
				return res.status(200).json(users.length);
			});
		}
	}
];

/**
 * Get number of dislikes by created date
 * @param {String} start
 * @param {String} end
 * @returns {Number}
 */
exports.GetDislikesCount = [
	function(req, res) {
		// statistics by date range
		if (req.query.start && req.query.end) {
			Dislikes.find(
				{
					createdAt: {
						$gte: moment(req.query.start)
							.startOf("day")
							.toDate(),
						$lte: moment(req.query.end)
							.endOf("day")
							.toDate()
					}
				},
				function(err, users) {
					if (err) {
						return res.status(500).json(err);
					}
					return res.status(200).json(users.length);
				}
			);
		} else {
			Dislikes.find({}, function(err, users) {
				if (err) {
					return res.status(500).json(err);
				}
				return res.status(200).json(users.length);
			});
		}
	}
];
