var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentOnUserSchema = new Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: false },
		likes: { type: Number, required: false, default: 0 },
		dislikes: { type: Number, required: false, default: 0 },
		text: { type: String, required: true },
		winner: { type: Schema.ObjectId, ref: "User", required: true },
		parentId: {
			type: Schema.ObjectId,
			ref: "CommentOnUser",
			required: false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model("CommentOnUser", CommentOnUserSchema);
