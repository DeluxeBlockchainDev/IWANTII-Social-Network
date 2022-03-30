const UserModel = require("../models/AdminModel");
const { body, validationResult } = require("express-validator");
const { sanitizeBody } = require("express-validator");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

/**
 * User registration.
 *
 * @param {string}      firstName
 * @param {string}      lastName
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.register = [
	// Validate fields.
	body("name")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Username must be specified."),
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address.")
		.custom(value => {
			return UserModel.findOne({ email: value }).then(user => {
				if (user) {
					return Promise.reject("E-mail already in use");
				}
			});
		}),
	body("password")
		.isLength({ min: 6 })
		.trim()
		.withMessage("Password must be 6 characters or greater."),
	// Sanitize fields.
	sanitizeBody("name").escape(),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	// Process request after validation and sanitization.
	(req, res) => {
		try {
			// Extract the validation errors from a request.
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				// Display sanitized values/errors messages.
				return res.status(400).json(errors);
			} else {
				//hash input password
				bcrypt.hash(req.body.password, 10, function(err, hash) {
					// Create User object with escaped and trimmed data
					var user = new UserModel({
						name: req.body.name,
						email: req.body.email,
						password: hash
					});
					// Save user.
					user.save(function(err) {
						if (err) {
							return res.status(500).json(err);
						}
						let userData = {
							_id: user._id,
							name: user.name,
							email: user.email
						};
						return res.status(200).json(userData);
					});
				});
			}
		} catch (err) {
			//throw error in json response with status 500.
			return res.status(500).json(err);
		}
	}
];

/**
 * User login.
 *
 * @param {string}      email
 * @param {string}      password
 *
 * @returns {Object}
 */
exports.login = [
	body("email")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Email must be specified.")
		.isEmail()
		.withMessage("Email must be a valid email address."),
	body("password")
		.isLength({ min: 1 })
		.trim()
		.withMessage("Password must be specified."),
	sanitizeBody("email").escape(),
	sanitizeBody("password").escape(),
	(req, res) => {
		try {
			const errors = validationResult(req);
			if (!errors.isEmpty()) {
				return res.status(400).json(errors);
			} else {
				UserModel.findOne({ email: req.body.email }).then(user => {
					if (user) {
						//Compare given password with db's hash.
						bcrypt.compare(req.body.password, user.password, function(
							err,
							same
						) {
							if (same) {
								let userData = {
									_id: user._id,
									name: user.name,
									email: user.email
								};
								//Prepare JWT token for authentication
								const jwtPayload = userData;
								const jwtData = {
									expiresIn: process.env.JWT_TIMEOUT_DURATION
								};
								const secret = process.env.JWT_SECRET;
								//Generated JWT token with Payload and secret.
								userData.token = jwt.sign(jwtPayload, secret, jwtData);
								return res.status(200).json(userData);
							} else {
								return res.status(401).json("Email or Password wrong.");
							}
						});
					} else {
						return res.status(401).json("Email or Password wrong.");
					}
				});
			}
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];
