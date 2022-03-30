const Request = require("../models/RequestModel");
const Countdown = require("../models/CountdownModel");
const User = require("../models/UserModel");
const Like = require("../models/LikesModel");
const Dislike = require("../models/DislikesModel");
const { body, validationResult } = require("express-validator");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const requestHelper = require("../helpers/requestHelper");
/**
 * Get all requests
 */
exports.AllRequests = [
	async function(req, res) {
		try {
			let params = {};
			if (req.query.countdown) {
				params = {
					...params,
					countdown: req.query.countdown
				};
			}
			if (req.query.user) {
				params = {
					...params,
					user: req.query.user
				};
			}
			// sort by likes desc
			if (req.query.top) {
				const reqeusts = await Request.find({})
					.sort({ likes: -1 })
					.limit(Number(req.query.top));
				return res.status(200).json(reqeusts);
			}
			// sort by dislikes desc
			else if (req.query.worst) {
				const reqeusts = await Request.find({})
					.sort({ dislikes: -1 })
					.limit(Number(req.query.worst));
				return res.status(200).json(reqeusts);
			} else {
				Request.find(params, function(err, requests) {
					// return count only
					if (req.query.count) {
						if (typeof requests === "undefined") {
							return res.status(200).json(0);
						}
						return res.status(200).json(requests.length);
					}
					return res.status(200).json(requests);
				});
			}
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Get a reqeust detail by id
 * @param {String} id
 * @returns {Object}
 */
exports.RequestDetail = [
	function(req, res) {
		try {
			Request.findById(req.params.id, function(err, request) {
				if (err) {
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
 * Create a request
 */
exports.NewRequest = [
	body("text", "request text must not be empty")
		.isLength({ min: 1 })
		.trim(),
	body("countdown", "countdown must not be empty")
		.isLength({ min: 1 })
		.trim(),
	body("user", "user must not be empty")
		.isLength({ min: 1 })
		.trim(),
	async function(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors);
		}

		// user validation
		try {
			const user = await User.findById(req.body.user);
			if (user === null) {
				return res
					.status(400)
					.json("user id " + req.body.user + " does not exist.");
			}
		} catch (err) {
			return res.status(400).json("user does not exist.");
		}
		// countdown validation
		try {
			const countdown = await Countdown.findById(req.body.countdown);
			if (countdown === null) {
				return res
					.status(400)
					.json("Countdown id " + req.body.countdown + " does not exist.");
			}
		} catch (err) {
			return res.status(400).json("Countdown does not exist.");
		}

		// request duplication validation
		Request.findOne(
			{
				user: req.body.user,
				countdown: req.body.countdown
			},
			async function(err, foundRequest) {
				if (foundRequest) {
					return res
						.status(400)
						.json("Already sent request to this countdown.");
				}
				var newRequest = new Request(req.body);

				// validation check
				let validationRes = await requestHelper.validateRequest(newRequest);
				if (validationRes) {
					return res.status(400).json(validationRes.message);
				}

				newRequest.save(function(err) {
					if (err) {
						return res.status(500).json(err);
					}

					// set isLive true for requester
					User.findByIdAndUpdate(req.body.user, { isLive: true }, function(
						err
					) {
						if (err) {
							return res.status(500).json(err);
						}

						// save reqeust and trigger socket events
						requestHelper.newRequest(req.io.sockets, req.body.countdown);

						// return new request
						res.setHeader("Location", newRequest._id);
						return res.status(201).json();
					});
				});
			}
		);
	}
];

/**
 * Update request
 * @param {String} id
 * @param {Request} request
 */
exports.UpdateReqeust = [
	body("text", "request text must not be empty")
		.isLength({ min: 1 })
		.trim(),
	body("countdown", "countdown must not be empty")
		.isLength({ min: 1 })
		.trim(),
	body("user", "user must not be empty")
		.isLength({ min: 1 })
		.trim(),
	async function(req, res) {
		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			return res.status(400).json(errors);
		}

		try {
			// user validation
			try {
				const user = await User.findById(req.body.user);
				if (user === null) {
					return res
						.status(400)
						.json("user id " + req.body.user + " does not exist.");
				}
			} catch (err) {
				return res.status(400).json("user does not exist.");
			}
			// countdown validation
			try {
				const countdown = await Countdown.findById(req.body.countdown);
				if (countdown === null) {
					return res
						.status(400)
						.json("Countdown id " + req.body.countdown + " does not exist.");
				}
			} catch (err) {
				return res.status(400).json("Countdown does not exist.");
			}
			Request.findById(req.params.id, function(err, request) {
				if (request === null) {
					return res.status(404).json(err);
				}
				Request.findByIdAndUpdate(
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
 * set like to request
 */
exports.LikeRequest = [
	function(req, res) {
		Request.findById(req.params.id, function(err, request) {
			if (request === null) {
				return res.status(404).json();
			} else {
				request.likes = request.likes + 1;
				Request.findByIdAndUpdate(req.params.id, request, {}, function(err) {
					if (err) {
						return res.status(500).json();
					} else {
						Like.findOne({ user: req.body.user, ref: request._id }, function(
							err,
							found
						) {
							if (found) {
								return res.status(400).json("Already set.");
							}
							let like = new Like({ user: req.body.user, ref: request._id });
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
 * set dislike to request
 */
exports.DislikeRequest = [
	function(req, res) {
		Request.findById(req.params.id, function(err, request) {
			if (request === null) {
				return res.status(404).json();
			} else {
				request.dislikes = request.dislikes + 1;
				Request.findByIdAndUpdate(req.params.id, request, {}, function(err) {
					if (err) {
						return res.status(500).json();
					} else {
						Dislike.findOne({ user: req.body.user, ref: request._id }, function(
							err,
							found
						) {
							if (found) {
								return res.status(400).json("Already set.");
							}
							let dislike = new Dislike({
								user: req.body.user,
								ref: request._id
							});
							dislike.save(function(err) {
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
 * Remove reqeust
 * @param {String} id
 */
exports.RemoveRequest = [
	function(req, res) {
		try {
			Request.findById(req.params.id, function(err, request) {
				if (request === null) {
					return res.status(404).json(err);
				}
				Request.findByIdAndRemove(req.params.id, function(err) {
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
