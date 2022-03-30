var mongoose = require("mongoose");

var AdminSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		password: { type: String, required: true },
		status: { type: Boolean, required: true, default: 0 }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("admin", AdminSchema);
