var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentOnCountdownSchema = new Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: true },
		likes: { type: Number, required: false, default: 0 },
		dislikes: { type: Number, required: false, default: 0 },
		text: { type: String, required: true },
		countdown: { type: Schema.ObjectId, ref: "Countdown", required: true },
		parentId: {
			type: Schema.ObjectId,
			ref: "CommentOnCountdown",
			required: false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("CommentOnCountdown", CommentOnCountdownSchema);
