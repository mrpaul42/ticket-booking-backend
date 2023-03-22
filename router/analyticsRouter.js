const express = require("express");
const router = express.Router();
const analyticsController = require("../controller/analytics");

router.get("/profit", analyticsController.getProfitBetweenDates);
router.get("/visited", analyticsController.getVisitedBetweenDates);

module.exports = router;
