var express = require("express");
const ConfigController = require("../controllers/Settings/ConfigController");
const SeoController = require("../controllers/Settings/SeoController");
const ContentsController = require("../controllers/Settings/ContentsController");

var router = express.Router();

// configuration
router.get("/config", ConfigController.GetConfig);
router.put("/config", ConfigController.UpdateConfig);

// landing page contents
router.get("/contents", ContentsController.GetContents);
router.put("/contents", ContentsController.UpdateContents);

// seo options
router.get("/seo", SeoController.GetSEO);
router.put("/seo", SeoController.UpdateSEO);

module.exports = router;
