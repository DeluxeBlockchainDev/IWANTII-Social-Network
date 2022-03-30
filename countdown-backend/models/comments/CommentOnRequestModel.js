var mongoose = require("mongoose");

var Schema = mongoose.Schema;

var CommentOnRequestSchema = new Schema(
	{
		user: { type: Schema.ObjectId, ref: "User", required: false },
		likes: { type: Number, required: false, default: 0 },
		dislikes: { type: Number, required: false, default: 0 },
		text: { type: String, required: true },
		request: { type: Schema.ObjectId, ref: "Request", required: true },
		parentId: {
			type: Schema.ObjectId,
			ref: "CommentOnRequestSchema",
			required: false
		}
	},
	{ timestamps: true }
);

module.exports = mongoose.model(
	"CommentOnRequestSchema",
	CommentOnRequestSchema
);
