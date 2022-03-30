var express = require("express");
var router = express.Router();
const CountdownController = require("../controllers/CountdownController");
const CommentController = require("../controllers/comments/CommentOnCountdownController");

router.get("/", CountdownController.AllCountdowns);
router.get("/:id", CountdownController.CountdownDetail);
router.post("/", CountdownController.NewCountdown);
router.put("/:id", CountdownController.UpdateCountdown);
router.delete("/:id", CountdownController.RemoveCountdown);
router.put("/:id/like", CountdownController.LikeCountdown);
router.put("/:id/dislike", CountdownController.DislikeCountdown);

// comments
router.get("/comments/all", CommentController.AllComments);
router.get("/:id/comments", CommentController.CommentsById);
router.get("/:id/comments/:commentId", CommentController.CommentDetail);
router.post("/:id/comments", CommentController.NewComment);
router.put("/:id/comments/:commentId", CommentController.UpdateComment);
router.delete("/:id/comments/:commentId", CommentController.RemoveComment);
router.put("/:id/comments/:commentId/like", CommentController.LikeComment);
router.put(
	"/:id/comments/:commentId/dislike",
	CommentController.DislikeComment
);

module.exports = router;
