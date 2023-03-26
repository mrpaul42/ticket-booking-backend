const { v4: uuid } = require("uuid");
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

exports.createTicket = async (req, res, next) => {
  try {
    const body = req.body;
    const ticket_id = "TIX_" + uuid();
    const created_at = new Date("2023-03-25");
    const data = [
      ticket_id,
      body.customer_id,
      body.customer_name,
      body.movie_time,
      body.movie_title,
      body.ticket_price,
      created_at,
    ];
    console.log("query elements array ", data);

    const createQuery =
      "INSERT INTO tickets (ticket_id, customer_id, customer_name, movie_time, movie_title, ticket_price, created_at) VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *";

    await pool.query(createQuery, data, (err, result) => {
      if (err) {
        return res
          .status(400)
          .json({ status: "failure", message: err.message });
      }
      return res.status(201).json({ status: "success", data: result.rows });
    });
  } catch (err) {
    console.log("catch exception in create ticket --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

exports.getTicketInfoById = async (req, res, next) => {
  try {
    const { ticketId } = req.params;
    if (!ticketId) {
      res.status(400).json({ status: "failure", message: "Bad request." });
    }
    const fetchQuery = "SELECT * FROM tickets WHERE ticket_id = $1";
    await pool.query(fetchQuery, [ticketId], (err, result) => {
      if (err) {
        console.log(err);
        return res
          .status(400)
          .json({ status: "failure", message: err.message });
      } else if (result && result.rows && result.rows.length > 0) {
        return res.status(200).json({ status: "success", data: result.rows });
      } else {
        return res
          .status(400)
          .json({ status: "failure", message: "data not found in DB." });
      }
    });
  } catch (err) {
    console.log("catch exception in fetch ticket --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

exports.updateTicketInfoById = async (req, res, next) => {
  try {
    const data = req.body;
    const { ticketId } = req.params;
    if (!ticketId) {
      res.status(400).json({ status: "failure", message: "Bad request." });
    }
    const payloadArray = [
      data.customer_name,
      data.movie_title,
      data.movie_time,
      data.ticket_price,
      ticketId,
    ];
    console.log("payloadArray", payloadArray);

    const updateQuery =
      "UPDATE tickets SET customer_name = $1, movie_title = $2, movie_time = $3, ticket_price = $4 WHERE ticket_id=$5 RETURNING *";

    await pool.query(updateQuery, payloadArray, (err, result) => {
      console.log(result);
      if (err) {
        return res
          .status(400)
          .json({ status: "failure", message: err.message });
      } else if (result && result.rows && result.rows.length > 0) {
        return res.status(200).json({ status: "success", data: result.rows });
      } else {
        return res
          .status(400)
          .json({ status: "failure", message: "data not updated in DB." });
      }
    });
  } catch (err) {
    console.log("catch exception in update ticket --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

exports.deleteTicketInfoById = async (req, res, next) => {
  try {
    const ticket_id = req.params.ticketId;
    if (!ticket_id) {
      res.status(400).json({ status: "failure", message: "Bad request." });
    }

    const deleteQuery = "DELETE FROM tickets WHERE ticket_id=$1";

    await pool.query(deleteQuery, [ticket_id], (err, result) => {
      if (err) {
        res
          .status(400)
          .json({ status: "failure", message: "Something went wrong." });
      }
      return res
        .status(200)
        .json({ status: "Success", message: "Ticket deleted successfully." });
    });
  } catch (err) {
    console.log("catch exception in delete ticket --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};
