const User = require("../models/UserModel");
const Like = require("../models/LikesModel");
const Dislike = require("../models/DislikesModel");
const Request = require("../models/RequestModel");
const Countdown = require("../models/CountdownModel");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const fs = require("fs");
const path = require("path");
const dirPath = "./../models/";
const fileName = "Settings.json";
const socketService = require("../helpers/socket");

/**
 * Get all users
 */
exports.AllUser = [
	async function(req, res) {
		try {
			// Get live user by ip address
			// check whether same ip is using or not.
			// A request can be send by a IP address
			let params = {};
			if (req.query.ip) {
				params = {
					...params,
					ip: req.query.ip
				};
			}
			// return all live users
			if (req.query.isLive) {
				params = {
					...params,
					isLive: Boolean(req.query.isLive)
				};
			}
			// return users by email
			if (req.query.email) {
				params = {
					...params,
					email: req.query.email
				};
			}
			// top users
			if (req.query.top) {
				const users = await User.find({})
					.sort({ likes: -1 })
					.limit(Number(req.query.top));
				return res.status(200).json(users);
			} else {
				User.find(params, function(err, users) {
					if (err) {
						return res.status(500).json(err);
					}
					return res.status(200).json(users);
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return res.status(500).json(err);
		}
	}
];

/**
 * New User
 * @param {String} username
 * @param {String} email
 * @param {String} country
 */
exports.AddUser = [
	function(req, res) {
		try {
			User.findOne({ email: req.body.email }).then(user => {
				if (user) {
					return res.status(409).json("Email is already existed.");
				} else {
					var newUser = new User(req.body);

					// if fake user, set dummy request to dummy countdown
					// check auto fake request option
					let rawdata = fs.readFileSync(
						path.join(__dirname, dirPath, fileName),
						"UTF-8"
					);
					let config = JSON.parse(rawdata).config;
					if (config.fakeRequest && !req.body.isReal) {
						Countdown.findOne({ winner: { $exists: false } }, async function(
							err,
							found
						) {
							if (found) {
								let faker = require("faker");
								const requst = new Request({
									user: newUser._id,
									text: faker.lorem.sentences(),
									countdown: found._id
								});
								await requst.save();
								// emit socket event
								socketService.newRequest(req.io.sockets);
							}
						});
					}

					// save new user
					newUser.save(function(err) {
						if (err) {
							return res.status(500).json(err);
						}
						res.setHeader("Location", newUser._id);
						return res.status(201).json(newUser);
					});
				}
			});
		} catch (err) {
			//throw error in json response with status 500.
			return res.status(500).json(err);
		}
	}
];

/**
 * get user detail
 * @param {String} id
 */
exports.DetailUser = [
	async function(req, res) {
		try {
			User.findById(req.params.id, function(err, request) {
				if (request === null) {
					return res.status(404).json();
				}
				return res.status(200).json(request);
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * update user
 * @param {String} id
 * @param {Object}
 */
exports.updateUser = [
	async function(req, res) {
		try {
			User.findById(req.params.id, function(err, founded) {
				if (founded === null) {
					return res.status(404).json(err);
				}
				User.findOne({ email: req.body.email }, function(err, found) {
					if (founded.email !== req.body.email && found) {
						return res.status(409).json("Email is already existed.");
					}
					User.findByIdAndUpdate(
						req.params.id,
						req.body,
						{ timestamps: false },
						function(err) {
							if (err) {
								return res.status(500).json();
							}
							return res.status(200).json();
						}
					);
				});
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Remove user
 * @param {String} id
 */
exports.RemoveUser = [
	function(req, res) {
		try {
			User.findById(req.params.id, function(err, request) {
				if (request === null) {
					return res.status(404).json(err);
				}
				User.findByIdAndRemove(req.params.id, function(err) {
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

/**
 * Get live user by ip address
 * check whether same ip is using or  not.
 * A request can be send by a IP address
 * @param {string} ip
 */
exports.LiveUserByIP = [
	async function(req, res) {
		try {
			const user = await User.findOne({ ip: req.body.ip, isLive: true });
			if (user === null) {
				return res.status(400).json("user does not exist.");
			}
			return res.status(200).json(user);
		} catch (err) {
			return res.status(500).json("user table does not exist.");
		}
	}
];

/**
 * leave countdown
 * @param {String} id
 */
exports.LeaveCountdown = [
	function(req, res) {
		User.findById(req.params.id, function(err, foundUser) {
			if (foundUser === null) {
				return res.status(404).json();
			} else {
				foundUser.isLive = false;
				User.findByIdAndUpdate(req.params.id, foundUser, {}, function(err) {
					if (err) {
						return res.status(500).json(err);
					} else {
						return res.status(200).json();
					}
				});
			}
		});
	}
];

/**
 * Like user
 * @param {String} id
 */
exports.LikeUser = [
	function(req, res) {
		User.findById(req.params.id, function(err, foundUser) {
			if (foundUser === null) {
				return res.status(404).json();
			} else {
				foundUser.likes = foundUser.likes + 1;
				User.findByIdAndUpdate(req.params.id, foundUser, {}, function(err) {
					if (err) {
						return res.status(500).json();
					} else {
						Like.findOne({ user: req.body.user, ref: foundUser._id }, function(
							err,
							found
						) {
							if (found) {
								return res.status(400).json("Already set.");
							}
							let like = new Like({ user: req.body.user, ref: foundUser._id });
							like.save(function(err) {
								if (err) {
									return res.status(500).json(err);
								}
								return res.status(200).json();
							});
						});
					}
				});
			}
		});
	}
];

/**
 * Dislike user
 * @param {String} id
 */
exports.DislikeUser = [
	function(req, res) {
		User.findById(req.params.id, function(err, foundUser) {
			if (foundUser === null) {
				return res.status(404).json();
			} else {
				foundUser.dislikes = foundUser.dislikes + 1;
				User.findByIdAndUpdate(req.params.id, foundUser, {}, function(err) {
					if (err) {
						return res.status(500).json(err);
					} else {
						Dislike.findOne(
							{ user: req.body.user, ref: foundUser._id },
							function(err, found) {
								if (found) {
									return res.status(400).json("Already set.");
								}
								let dislike = new Dislike({
									user: req.body.user,
									ref: foundUser._id
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
