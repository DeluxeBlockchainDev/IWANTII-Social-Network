var mongoose = require("mongoose");
var Schema = mongoose.Schema;

var DislikesSchema = new mongoose.Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: false },
		ref: { type: String, required: true }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Dislike", DislikesSchema);
