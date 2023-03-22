const express = require("express");
const app = express();
const mongoose = require("mongoose");
const bodyParser = require("body-parser");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const ticketRouter = require("./router/ticketRouter");
const authRouter = require("./router/authRouter");
const authController = require("./controller/auth");
const analyticsRouter = require("./router/analyticsRouter");

const mongoUrl = process.env.MONGO_URL;
mongoose.connect(mongoUrl);
const db = mongoose.connection;

db.on("error", console.error.bind(console, "db connect error"));
db.once("open", () => {
  console.log("db connected");
});

app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/ticket", authController.protect, ticketRouter);
app.use("/analytics", authController.protect, analyticsRouter);

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
