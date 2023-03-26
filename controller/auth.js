const jwt = require("jsonwebtoken");
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

exports.protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: "failure",
        message: "Unauthorized",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    await pool.query(
      "SELECT * FROM customers WHERE customer_id = $1",
      [decoded.customer_id],
      (err, result) => {
        if (err) {
          return res.status(401).json({
            status: "failure",
            message: err,
          });
        } else if (result && result.rows && result.rows.length > 0) {
          next();
        } else {
          return res.status(401).json({
            status: "failure",
            message: "Unauthorized",
          });
        }
      }
    );
  } catch (err) {
    console.log("catch exception --->", err);
    return res.status(400).json({
      status: "failure",
      message: err.message,
    });
  }
};

exports.getJwtToken = async (req, res, next) => {
  try {
    const data = {
      customer_id: req.params.customerId,
    };
    console.log(data);
    if (!data.customer_id) {
      res.status(400).json({
        status: "failure",
        message: "customer_id is not present in req params.",
      });
    }
    const token = jwt.sign(data, process.env.JWT_SECRET, {
      expiresIn: process.env.JWT_EXPIRE,
    });
    if (token) {
      await pool.query(
        "INSERT INTO customers(customer_id) VALUES($1) RETURNING *",
        [data.customer_id],
        (err, result) => {
          if (err) {
            return res
              .status(400)
              .json({ status: "failure", message: err.message });
          }
          console.log("customer created --->", result.rows);
          return res.status(200).json({ status: "success", token });
        }
      );
    }
  } catch (err) {
    console.log("catch exception in get jwt token", err);
    res.status(400).json({ status: "failure", message: err.message });
  }
};
