const monthNames = require("../constant");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });
const Pool = require("pg").Pool;
const pool = new Pool({
  user: process.env.USER_NAME,
  host: process.env.HOST,
  database: process.env.DATABASE,
  password: process.env.PASSWORD,
  port: process.env.PORT,
});

const getProfitAnalyticsByAggregation = async (startDate, endDate) => {
  try {
    const fetchProfitQuery = `SELECT to_char(date_trunc('month', created_at), 'Month') as month, SUM(ticket_price) as "summaryProfit" FROM tickets WHERE created_at >= $1 AND created_at <= $2 GROUP BY month ORDER BY month ASC`;
    const { rows } = await pool.query(fetchProfitQuery, [startDate, endDate]);
    return rows;
  } catch (err) {
    console.log("catch exception --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const getProfitAnalyticsByJavascriptLogic = async (startDate, endDate) => {
  try {
    const fetchProfitQuery =
      "SELECT * FROM tickets WHERE created_at >= $1 AND created_at <= $2 ORDER BY created_at ASC";
    const { rows } = await pool.query(fetchProfitQuery, [startDate, endDate]);
    if (!(rows && rows.length > 0))
      return {
        status: "success",
        message: "Data not found within the date range.",
      };
    const d = new Date(rows[0].created_at);
    let month = monthNames[d.getMonth()];
    let result = [],
      summaryProfit = 0;
    rows.forEach((ele) => {
      const d = new Date(ele.created_at);
      if (monthNames[d.getMonth()] === month) {
        summaryProfit += ele.ticket_price;
      } else {
        result.push({ month, summaryProfit });
        month = monthNames[d.getMonth()];
        summaryProfit = ele.ticket_price;
      }
    });
    result.push({ month, summaryProfit });
    console.log(result, "array");
    return result;
  } catch (err) {
    console.log("catch exception --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

const getVisitAnalyticsByAggregation = async (startDate, endDate) => {
  try {
    const fetchProfitQuery = `SELECT to_char(date_trunc('month', created_at), 'Month') as month, COUNT(*) as "summaryVisits" FROM tickets WHERE created_at >= $1 AND created_at <= $2 GROUP BY month ORDER BY month ASC`;
    const { rows } = await pool.query(fetchProfitQuery, [startDate, endDate]);
    return rows;
  } catch (err) {
    console.log("catch exception --->", err);
    throw new Error(err);
  }
};

const getVisitAnalyticsByJavascriptLogic = async (startDate, endDate) => {
  try {
    const fetchProfitQuery =
      "SELECT * FROM tickets WHERE created_at >= $1 AND created_at <= $2 ORDER BY created_at ASC";
    const { rows } = await pool.query(fetchProfitQuery, [startDate, endDate]);
    console.log(rows);
    if (!(rows && rows.length > 0))
      return {
        status: "success",
        message: "Data not found within the date range.",
      };
    const d = new Date(rows[0].created_at);
    let month = monthNames[d.getMonth()];
    let result = [],
      summaryVisits = 0;
    rows.forEach((ele) => {
      const d = new Date(ele.created_at);
      if (monthNames[d.getMonth()] === month) {
        summaryVisits += 1;
      } else {
        result.push({ month, summaryVisits });
        month = monthNames[d.getMonth()];
        summaryVisits = 1;
      }
    });
    result.push({ month, summaryVisits });
    console.log(result, "array");
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
