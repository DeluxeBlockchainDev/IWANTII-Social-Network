const Countdown = require("../../models/CountdownModel");
const Comment = require("../../models/comments/CommentOnCountdownModel");
const User = require("../../models/UserModel");
const Like = require("../../models/LikesModel");
const Dislike = require("../../models/DislikesModel");
var mongoose = require("mongoose");
mongoose.set("useFindAndModify", false);
const { body, validationResult } = require("express-validator");

/**
 * Get all comments
 */
exports.AllComments = [
	function(req, res) {
		try {
			Comment.find({}, function(err, comments) {
				return res.status(200).json(comments);
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Get all comments by countdown id
 */
exports.CommentsById = [
	function(req, res) {
		try {
			Comment.find({ countdown: req.params.id }, function(err, comments) {
				// return count only
				if (req.query.count) {
					if (typeof comments === "undefined") {
						return res.status(200).json(0);
					}
					return res.status(200).json(comments.length);
				}
				return res.status(200).json(comments);
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Get a comment detail by id
 * @param {String} id
 * @returns {Object}
 */
exports.CommentDetail = [
	function(req, res) {
		try {
			Comment.findById(req.params.commentId, function(err, comment) {
				if (comment === null) {
					return res.status(404).json();
				}
				return res.status(200).json(comment);
			});
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Create a comment
 */
exports.NewComment = [
	body("text", "comment text must not be empty")
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
		// prevent same comment
		try {
			const comment = await Comment.findOne({
				countdown: req.body.countdown,
				text: req.body.text
			});
			if (comment !== null) {
				return res.status(400).json("Same comment is existed.");
			}
		} catch (err) {
			return res.status(400).json("Comments does not exist.");
		}

		var newComment = new Comment(req.body);
		newComment.save(function(err) {
			if (err) {
				return res.status(500).json(err);
			}
			res.setHeader("Location", newComment._id);
			return res.status(201).json();
		});
	}
];

/**
 * Update comment
 * @param {String} id
 * @param {Comment} comment
 */
exports.UpdateComment = [
	body("text", "comment text must not be empty")
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

		try {
			Comment.findById(req.params.commentId, async function(err, found) {
				if (found === null) {
					return res.status(404).json(err);
				}
				if (
					found.countdown.toString() !== req.body.countdown ||
					found.user.toString() !== req.body.user
				) {
					// prevent same comment
					try {
						const comment = await Comment.findOne({
							countdown: req.body.countdown,
							text: req.body.text
						});
						if (comment !== null) {
							return res
								.status(400)
								.json("Same comment is existed.");
						}
					} catch (err) {
						return res.status(400).json("Comments does not exist.");
					}
				}

				Comment.findByIdAndUpdate(
					req.params.commentId,
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
 * set like to comment
 */
exports.LikeComment = [
	function(req, res) {
		Comment.findById(req.params.commentId, function(err, comment) {
			if (comment === null) {
				return res.status(404).json();
			} else {
				comment.likes = comment.likes + 1;
				Comment.findByIdAndUpdate(req.params.commentId, comment, {}, function(
					err
				) {
					if (err) {
						return res.status(500).json();
					} else {
						Like.findOne({ user: req.body.user, ref: comment._id }, function(
							err,
							found
						) {
							if (found) {
								return res.status(400).json("Already set.");
							}
							let like = new Like({ user: req.body.user, ref: comment._id });
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
 * set dislike to comment
 */
exports.DislikeComment = [
	function(req, res) {
		Comment.findById(req.params.commentId, function(err, comment) {
			if (comment === null) {
				return res.status(404).json();
			} else {
				comment.dislikes = comment.dislikes + 1;
				Comment.findByIdAndUpdate(req.params.commentId, comment, {}, function(
					err
				) {
					if (err) {
						return res.status(500).json();
					} else {
						Dislike.findOne({ user: req.body.user, ref: comment._id }, function(
							err,
							found
						) {
							if (found) {
								return res.status(400).json("Already set.");
							}
							let dislike = new Dislike({
								user: req.body.user,
								ref: comment._id
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
 * Remove comment
 * @param {String} id
 */
exports.RemoveComment = [
	function(req, res) {
		try {
			Comment.findById(req.params.commentId, function(err, comment) {
				if (comment === null) {
					return res.status(404).json(err);
				}
				Comment.findByIdAndRemove(req.params.commentId, function(err) {
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
