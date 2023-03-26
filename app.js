const express = require("express");
const app = express();
const bodyParser = require("body-parser");

const ticketRouter = require("./router/ticketRouter");
const authRouter = require("./router/authRouter");
const authController = require("./controller/auth");
const analyticsRouter = require("./router/analyticsRouter");

app.use(bodyParser.json());

app.use("/auth", authRouter);
app.use("/ticket", authController.protect, ticketRouter);
app.use("/analytics", authController.protect, analyticsRouter);

app.listen(3000, () => {
  console.log("app is running on port 3000");
});
