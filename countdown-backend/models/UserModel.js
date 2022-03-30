var mongoose = require("mongoose");

var UserSchema = new mongoose.Schema(
	{
		name: { type: String, required: true },
		email: { type: String, required: true },
		likes: { type: Number, required: false, default: 0 },
		dislikes: { type: Number, required: false, default: 0 },
		ip: { type: String, required: true },
		country: { type: String, required: true },
		isLive: { type: Boolean, required: false, default: true },
		isReal: { type: Boolean, required: false, default: false },
		active: { type: Boolean, required: false, default: true },
		wins: { type: Number, required: false, default: 0 },
		sameLinks: { type: Number, required: false, default: 0 },
		sameRequest: { type: Number, required: false, default: 0 },
		link: { type: String, required: false },
		request: { type: String, required: false }
	},
	{ timestamps: true }
);

module.exports = mongoose.model("User", UserSchema);
