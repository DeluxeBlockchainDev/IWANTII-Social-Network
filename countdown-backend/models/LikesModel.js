var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var LikesSchema = new mongoose.Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: true },
		ref: { type: String, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Like", LikesSchema);
