const fs = require("fs");
const path = require("path");
const dirPath = "./../../models/";
const fileName = "Settings.json";

/**
 * Get Contents options
 */
exports.GetContents = [
	function(req, res) {
		try {
			let rawdata = fs.readFileSync(
				path.join(__dirname, dirPath, fileName),
				"utf8"
			);
			let settings = JSON.parse(rawdata);
			return res.status(200).json(settings.landing);
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Update Contents options
 */
exports.UpdateContents = [
	function(req, res) {
		try {
			let rawdata = fs.readFileSync(
				path.join(__dirname, dirPath, fileName),
				"UTF-8"
			);
			let settings = JSON.parse(rawdata);

			settings.landing.title = req.body.title;
			settings.landing.howto = req.body.howto;
			settings.landing.description = req.body.description;

			fs.writeFileSync(
				path.join(__dirname, dirPath, fileName),
				JSON.stringify(settings),
				"utf8"
			);

			return res.status(200).json();
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];
