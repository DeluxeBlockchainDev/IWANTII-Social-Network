const fs = require("fs");
const path = require("path");
const dirPath = "./../../models/";
const fileName = "Settings.json";

/**
 * Get SEO options
 */
exports.GetSEO = [
	function(req, res) {
		try {
			let rawdata = fs.readFileSync(
				path.join(__dirname, dirPath, fileName),
				"utf8"
			);
			let settings = JSON.parse(rawdata);
			return res.status(200).json(settings.seo);
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Update SEO options
 */
exports.UpdateSEO = [
	function(req, res) {
		try {
			let rawdata = fs.readFileSync(
				path.join(__dirname, dirPath, fileName),
				"UTF-8"
			);
			let settings = JSON.parse(rawdata);

			settings.seo.title = req.body.title;
			settings.seo.description = req.body.description;
			settings.seo.keywords = req.body.keywords;

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
