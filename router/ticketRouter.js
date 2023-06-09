const express = require("express");
const router = express.Router();
const ticketController = require("../controller/ticket");

router.post("/", ticketController.createTicket);
router.get("/:ticketId", ticketController.getTicketInfoById);
router.patch("/:ticketId", ticketController.updateTicketInfoById);
router.delete("/:ticketId", ticketController.deleteTicketInfoById);

module.exports = router;
