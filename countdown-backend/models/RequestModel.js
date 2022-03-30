var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var RequestSchema = new Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: false },
		text: { type: String, required: true },
		likes: { type: Number, required: false, default: 0 },
		dislikes: { type: Number, required: false, default: 0 },
		countdown: { type: Schema.ObjectId, ref: "Countdown", required: true },
		ip: { type: String, required: false }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Request", RequestSchema);
