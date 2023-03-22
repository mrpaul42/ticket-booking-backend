const express = require("express");
const router = express();

const authController = require("../controller/auth");

router.get("/jwt/:customerId", authController.getJwtToken);

module.exports = router;
