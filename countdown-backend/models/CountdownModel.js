var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CountdownSchema = new Schema(
	{
		name: { type: String, required: true },
		winner: { type: Schema.ObjectId, ref: "User", required: false },
		request: { type: Schema.ObjectId, ref: "Request", required: false },
		likes: { type: Number, required: false, default: 0 },
		dislikes: { type: Number, required: false, default: 0 }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("Countdown", CountdownSchema);
