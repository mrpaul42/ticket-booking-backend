const analyticsHelper = require("../helper/analyticsHelper");

exports.getProfitBetweenDates = async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const method = req.query.method;
    if (method === "db-aggregation") {
      const data = await analyticsHelper.getProfitAnalyticsByAggregation(
        startDate,
        endDate
      );
      console.log(data);
      return res.status(200).json({ status: "success", data });
    } else {
      const data = await analyticsHelper.getProfitAnalyticsByJavascriptLogic(
        startDate,
        endDate
      );
      console.log("javascript logic", data);
      return res.status(200).json({ status: "success", data });
    }
  } catch (err) {
    console.log("catch exception in get profit", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

exports.getVisitedBetweenDates = async (req, res, next) => {
  try {
    const startDate = new Date(req.query.startDate);
    const endDate = new Date(req.query.endDate);
    const method = req.query.method;
    if (method === "db-aggregation") {
      const data = await analyticsHelper.getVisitAnalyticsByAggregation(
        startDate,
        endDate
      );
      console.log(data);
      return res.status(200).json({ status: "success", data });
    } else {
      const data = await analyticsHelper.getVisitAnalyticsByJavascriptLogic(
        startDate,
        endDate
      );
      console.log("javascript logic", data);
      return res.status(200).json({ status: "success", data });
    }
  } catch (err) {
    console.log("catch exception in get visits", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};
