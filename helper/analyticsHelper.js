const ticketSchema = require("../module/ticketSchema");
const monthNames = require("../constant");

const getProfitAnalyticsByAggregation = async (startDate, endDate) => {
  try {
    const data = await ticketSchema.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $addFields: {
          monthNumber: { $month: "$createdAt" },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$monthNumber", 1] }, then: "January" },
                { case: { $eq: ["$monthNumber", 2] }, then: "February" },
                { case: { $eq: ["$monthNumber", 3] }, then: "March" },
                { case: { $eq: ["$monthNumber", 4] }, then: "April" },
                { case: { $eq: ["$monthNumber", 5] }, then: "May" },
                { case: { $eq: ["$monthNumber", 6] }, then: "June" },
                { case: { $eq: ["$monthNumber", 7] }, then: "July" },
                { case: { $eq: ["$monthNumber", 8] }, then: "August" },
                { case: { $eq: ["$monthNumber", 9] }, then: "September" },
                { case: { $eq: ["$monthNumber", 10] }, then: "October" },
                { case: { $eq: ["$monthNumber", 11] }, then: "November" },
                { case: { $eq: ["$monthNumber", 12] }, then: "December" },
              ],
              default: "",
            },
          },
        },
      },
      {
        $group: {
          _id: "$monthName",
          summaryProfit: { $sum: "$ticket_price" },
          createdAt: { $push: "$createdAt" },
        },
      },
      {
        $project: {
          month: "$_id",
          summaryProfit: 1,
          createAt: { $arrayElemAt: ["$createdAt", 0] },
          _id: 0,
        },
      },
      {
        $sort: {
          createAt: 1,
        },
      },
      {
        $project: {
          createAt: 0,
        },
      },
    ]);

    return data;
  } catch (err) {
    console.log("catch exception --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const getProfitAnalyticsByJavascriptLogic = async (startDate, endDate) => {
  try {
    const data = await ticketSchema.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);
    const d = new Date(data[0].createdAt);
    let month = monthNames[d.getMonth()];
    let result = [],
      summaryProfit = 0;
    data.forEach((ele) => {
      const d = new Date(ele.createdAt);
      if (monthNames[d.getMonth()] === month) {
        summaryProfit += ele.ticket_price;
      } else {
        result.push({ month, summaryProfit });
        month = monthNames[d.getMonth()];
        summaryProfit = ele.ticket_price;
      }
    });
    result.push({ month, summaryProfit });
    return result;
  } catch (err) {
    console.log("catch exception --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const getVisitAnalyticsByAggregation = async (startDate, endDate) => {
  try {
    const data = await ticketSchema.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $addFields: {
          monthNumber: { $month: "$createdAt" },
        },
      },
      {
        $addFields: {
          monthName: {
            $switch: {
              branches: [
                { case: { $eq: ["$monthNumber", 1] }, then: "January" },
                { case: { $eq: ["$monthNumber", 2] }, then: "February" },
                { case: { $eq: ["$monthNumber", 3] }, then: "March" },
                { case: { $eq: ["$monthNumber", 4] }, then: "April" },
                { case: { $eq: ["$monthNumber", 5] }, then: "May" },
                { case: { $eq: ["$monthNumber", 6] }, then: "June" },
                { case: { $eq: ["$monthNumber", 7] }, then: "July" },
                { case: { $eq: ["$monthNumber", 8] }, then: "August" },
                { case: { $eq: ["$monthNumber", 9] }, then: "September" },
                { case: { $eq: ["$monthNumber", 10] }, then: "October" },
                { case: { $eq: ["$monthNumber", 11] }, then: "November" },
                { case: { $eq: ["$monthNumber", 12] }, then: "December" },
              ],
              default: "",
            },
          },
        },
      },
      {
        $group: {
          _id: "$monthName",
          count: { $sum: 1 },
          createdAt: { $push: "$createdAt" },
        },
      },
      {
        $project: {
          month: "$_id",
          summaryVisits: "$count",
          createAt: { $arrayElemAt: ["$createdAt", 0] },
          _id: 0,
        },
      },
      {
        $sort: {
          createAt: 1,
        },
      },
      {
        $project: {
          createAt: 0,
        },
      },
    ]);

    return data;
  } catch (err) {
    console.log("catch exception --->", err);
    throw new Error({ status: "failure" });
  }
};

const getVisitAnalyticsByJavascriptLogic = async (startDate, endDate) => {
  try {
    const data = await ticketSchema.aggregate([
      {
        $match: {
          createdAt: {
            $gte: startDate,
            $lte: endDate,
          },
        },
      },
      {
        $sort: { createdAt: 1 },
      },
    ]);
    const d = new Date(data[0].createdAt);
    let month = monthNames[d.getMonth()];
    let result = [],
      summaryVisits = 0;
    data.forEach((ele) => {
      const d = new Date(ele.createdAt);
      if (monthNames[d.getMonth()] === month) {
        summaryVisits += 1;
      } else {
        result.push({ month, summaryVisits });
        month = monthNames[d.getMonth()];
        summaryVisits = 1;
      }
    });
    result.push({ month, summaryVisits });
    return result;
  } catch (err) {
    console.log("catch exception --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

module.exports = {
  getProfitAnalyticsByAggregation,
  getProfitAnalyticsByJavascriptLogic,
  getVisitAnalyticsByAggregation,
  getVisitAnalyticsByJavascriptLogic,
};
