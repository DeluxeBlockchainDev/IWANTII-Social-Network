var express = require("express");
const StatisticsController = require("../controllers/StatisticsController");

var router = express.Router();

router.get("/users", StatisticsController.GetUsersCount);
router.get("/countdowns", StatisticsController.GetCountdownsCount);
router.get("/comments", StatisticsController.GetCommentsCount);
router.get("/like", StatisticsController.GetLikesCount);
router.get("/dislike", StatisticsController.GetDislikesCount);

module.exports = router;
