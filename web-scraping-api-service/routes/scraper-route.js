const express = require("express");

const { getScrapedContent } = require("../controllers/scraper-ctrl");

const router = express.Router();

router.route("/").get(getScrapedContent);

module.exports = router;
