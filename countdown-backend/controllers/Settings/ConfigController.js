const fs = require("fs");
const path = require("path");
const dirPath = "./../../models/";
const fileName = "Settings.json";

/**
 * Get configuration
 */
exports.GetConfig = [
	function(req, res) {
		try {
			let rawdata = fs.readFileSync(
				path.join(__dirname, dirPath, fileName),
				"utf8"
			);
			let settings = JSON.parse(rawdata);
			return res.status(200).json(settings.config);
		} catch (err) {
			return res.status(500).json(err);
		}
	}
];

/**
 * Update configuration
 */
exports.UpdateConfig = [
	function(req, res) {
		try {
			let rawdata = fs.readFileSync(
				path.join(__dirname, dirPath, fileName),
				"UTF-8"
			);
			let settings = JSON.parse(rawdata);

			settings.config.minUsers = req.body.minUsers;
			settings.config.duration = req.body.duration;
			settings.config.switches = req.body.switches;
			settings.config.winnerShowTime = req.body.winnerShowTime;
			settings.config.requestLength = req.body.requestLength;
			settings.config.fakeRequest = req.body.fakeRequest;
			settings.config.bans = req.body.bans;
			settings.config.sameReqeust = req.body.sameReqeust;
			settings.config.sameLink = req.body.sameLink;
			settings.config.maxWin = req.body.maxWin;

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
