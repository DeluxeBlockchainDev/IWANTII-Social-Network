const Countdown = require("../models/CountdownModel");
const User = require("../models/UserModel");
const Request = require("../models/RequestModel");
const Like = require("../models/LikesModel");
const Dislike = require("../models/DislikesModel");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const fs = require("fs");
const path = require("path");
const dirPath = "./../models/";
const fileName = "Settings.json";

/**
 * Get all countdowns
 */
exports.AllCountdowns = [
	async function(req, res) {
		if (req.query.top) {
			try {
				const countdowns = await Countdown.find({})
					.sort({ likes: -1 })
					.limit(Number(req.query.top));
				return res.status(200).json(countdowns);
			} catch (err) {
				return res.status(500).json(err);
			}
		} else {
			try {
				const countdowns = await Countdown.find({});
				return res.status(200).json(countdowns);
			} catch (err) {
				return res.status(500).json(err);
			}
		}
	}
];

/**
 * Get a countdown detail by id
 * @param {String} id
 * @returns {Object}
 */
exports.CountdownDetail = [
	async function(req, res) {
		try {
			// Get a last countdown
			if (req.params.id === "last") {
				let countdown = await Countdown.find({ winner: { $exists: true } })
					.sort({ createdAt: -1 })
					.limit(1);
				if (countdown) {
					return res.status(200).json(countdown[0]);
				}
				return res.status(404).json();
			}
			// Get current countdown
			// If no current countdown in progress, create a new one
			else if (req.params.id === "current") {
				Countdown.findOne({ winner: { $exists: false } }, function(err, found) {
					if (found) {
						return res.status(200).json(found);
					}
					let newCountdown = new Countdown({
						name: `${process.env.FAKE_COUNTDOWN_NAME}`
					});
					newCountdown.save(async function(err) {
						if (err) {
							return res.status(500).json(err);
						}

						// check auto fake request option
						let rawdata = fs.readFileSync(
							path.join(__dirname, dirPath, fileName),
							"UTF-8"
						);
						let config = JSON.parse(rawdata).config;
						if (config.fakeRequest) {
							// fake request
							const fakeUsers = await User.find({
								isReal: false,
								active: true
							});
							// set fake isLive
							fakeUsers.forEach(user => {
								User.findByIdAndUpdate(
									user._id,
									{ isLive: true },
									function() {}
								);
							});
							let faker = require("faker");

							// create fake reqeusts
							for (let i = 0; i < fakeUsers.length; i++) {
								const requst = new Request({
									user: fakeUsers[i]._id,
									text: faker.lorem.sentences(),
									countdown: newCountdown._id
								});
								await requst.save();
							}
						}

						res.setHeader("Location", newCountdown._id);
						return res.status(201).json(newCountdown);
					});
				});
			} else {
				Countdown.findById(req.params.id, function(err, countdown) {
					if (countdown) {
						return res.status(200).json(countdown);
					}
					return res.status(404).json();
				});
			}
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Create a countdown
 */
exports.NewCountdown = [
	async function(req, res) {
		// user validation
		try {
			const winner = await User.findById(req.body.winner);
			if (winner === null) {
				return res
					.status(400)
					.json("user id " + req.body.user + " does not exist.");
			}
		} catch (err) {
			return res.status(400).json("user does not exist.");
		}
		// request validation
		if (req.body.request) {
			try {
				const request = await Request.findById(req.body.request);
				if (request === null) {
					return res
						.status(400)
						.json("Reqeust id " + req.body.request + " does not exist.");
				}
			} catch (err) {
				return res.status(400).json("Request does not exist.");
			}
		}

		var newCountDown = new Countdown(req.body);

		newCountDown.save(function(err) {
			if (err) {
				return res.status(500).json(err);
			}

			res.setHeader("Location", newCountDown._id);
			return res.status(201).json();
		});
	}
];

/**
 * Update countdown
 * @param {String} id
 * @param {Countdown} countdown
 */
exports.UpdateCountdown = [
	async function(req, res) {
		try {
			// user validation
			try {
				const winner = await User.findById(req.body.winner);
				if (winner === null) {
					return res
						.status(400)
						.json("user id " + req.body.user + " does not exist.");
				}
			} catch (err) {
				return res.status(400).json("user does not exist.");
			}
			// request validation
			try {
				const request = await Request.findById(req.body.request);
				if (request === null) {
					return res
						.status(400)
						.json("Reqeust id " + req.body.request + " does not exist.");
				}
			} catch (err) {
				return res.status(400).json("Request does not exist.");
			}

			Countdown.findById(req.params.id, function(err, countdown) {
				if (countdown === null) {
					return res.status(404).json(err);
				}
				Countdown.findByIdAndUpdate(
					req.params.id,
					req.body,
					{ timestamps: false },
					function(err) {
						if (err) {
							return res.status(500).json(err);
						}
						return res.status(200).json();
					}
				);
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * set like to countdown
 */
exports.LikeCountdown = [
	function(req, res) {
		Countdown.findById(req.params.id, function(err, countdown) {
			if (err) {
				return res.status(404).json();
			} else {
				countdown.likes = countdown.likes + 1;
				Like.findOne({ user: req.body.user, ref: countdown._id }, function(
					err,
					found
				) {
					if (found) {
						return res.status(400).json("Already set.");
					}
					let like = new Like({ user: req.body.user, ref: countdown._id });
					like.save(function(err) {
						if (err) {
							return res.status(500).json(err);
						}
						Countdown.findByIdAndUpdate(req.params.id, countdown, {}, function(
							err
						) {
							if (err) {
								return res.status(500).json(err);
							} else {
								return res.status(200).json();
							}
						});
					});
				});
			}
		});
	}
];

/**
 * set dislike to countdown
 */
exports.DislikeCountdown = [
	function(req, res) {
		Countdown.findById(req.params.id, function(err, countdown) {
			if (err) {
				return res.status(404).json();
			} else {
				countdown.dislikes = countdown.dislikes + 1;
				Countdown.findByIdAndUpdate(req.params.id, countdown, {}, function(
					err
				) {
					if (err) {
						return res.status(500).json(err);
					} else {
						Dislike.findOne(
							{ user: req.body.user, ref: countdown._id },
							function(err, found) {
								if (found) {
									return res.status(400).json("Already set.");
								}
								let dislike = new Dislike({
									user: req.body.user,
									ref: countdown._id
								});
								dislike.save(function(err) {
									if (err) {
										return res.status(500).json(err);
									}
									return res.status(200).json();
								});
							}
						);
					}
				});
			}
		});
	}
];

/**
 * Remove countdown
 * @param {String} id
 */
exports.RemoveCountdown = [
	function(req, res) {
		try {
			Countdown.findById(req.params.id, function(err, countdown) {
				if (countdown === null) {
					return res.status(404).json(err);
				}
				Countdown.findByIdAndRemove(req.params.id, function(err) {
					if (err) {
						return res.status(500).json(err);
					}
					return res.status(200).json();
				});
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];
