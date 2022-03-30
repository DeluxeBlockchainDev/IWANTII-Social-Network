var express = require("express");
var router = express.Router();
const RequestController = require("../controllers/RequestController");
const CommentController = require("../controllers/comments/CommentOnRequestController");

router.get("/", RequestController.AllRequests);
router.get("/:id", RequestController.RequestDetail);
router.post("/", RequestController.NewRequest);
router.put("/:id", RequestController.UpdateReqeust);
router.delete("/:id", RequestController.RemoveRequest);
router.put("/:id/like", RequestController.LikeRequest);
router.put("/:id/dislike", RequestController.DislikeRequest);

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
