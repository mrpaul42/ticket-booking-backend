const jwt = require("jsonwebtoken");
const customerSchema = require("../module/customerSchema");

exports.protect = async (req, res, next) => {
  try {
    if (!req.headers.authorization) {
      return res.status(401).json({
        status: "failure",
        message: "Unauthorized",
      });
    }
    const token = req.headers.authorization.split(" ")[1];
    console.log(process.env.JWT_SECRET);
    const decoded = await jwt.verify(token, process.env.JWT_SECRET);
    console.log(decoded);
    const user = await customerSchema.findOne({
      customer_id: decoded.customer_id,
    });
    console.log(user);
    if (!user) {
      return res.status(401).json({
        status: "failure",
        message: "Unauthorized",
      });
    }
    next();
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
      data["token"] = token;
      await customerSchema.create(data);
      return res.status(200).json({ status: "success", token });
    }
    return res
      .status(400)
      .json({ status: "failure", message: "Something went wrong." });
  } catch (err) {
    console.log("catch exception in get jwt token", err);
    res.status(400).json({ status: "failure", message: err.message });
  }
};
