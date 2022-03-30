var express = require("express");
const UserController = require("../controllers/UserController");
const CommentController = require("../controllers/comments/CommentOnUserController");

var router = express.Router();

// /api/user?ip=127.0.0.1&isLive=true
router.get("/", UserController.AllUser);
router.post("/", UserController.AddUser);
router.get("/:id", UserController.DetailUser);
router.put("/:id", UserController.updateUser);
router.delete("/:id", UserController.RemoveUser);
router.put("/:id/like", UserController.LikeUser);
router.put("/:id/dislike", UserController.DislikeUser);
router.put("/:id/leave", UserController.LeaveCountdown);

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
