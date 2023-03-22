const ticketSchema = require("../module/ticketSchema");

exports.createTicket = async (req, res, next) => {
  try {
    const body = req.body;
    const data = {
      customer_id: body.customer_id,
      customer_name: body.customer_name,
      movie_time: body.movie_time,
      movie_title: body.movie_title,
      ticket_price: body.ticket_price,
    };
    console.log("data --->", data);
    const createdTicketInfo = await ticketSchema.create(data);
    console.log("createdTicketInfo --->", createdTicketInfo);
    if (createdTicketInfo && Object.keys(createdTicketInfo).length !== 0) {
      return res
        .status(201)
        .json({ status: "success", data: createdTicketInfo });
    }
    return res
      .status(400)
      .json({ status: "failure", message: "data not created in DB." });
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
    const query = {
      ticket_id: ticketId,
    };
    console.log("query --->", query);
    const fetchedTicketInfo = await ticketSchema.findOne(query);
    console.log("fetchedTicketInfo --->", fetchedTicketInfo);
    if (fetchedTicketInfo && Object.keys(fetchedTicketInfo).length !== 0)
      return res
        .status(200)
        .json({ status: "success", data: fetchedTicketInfo });
    return res
      .status(400)
      .json({ status: "failure", message: "data not found in DB." });
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
    const query = {
      ticket_id: ticketId,
    };
    const updatedTicketInfo = await ticketSchema.findOneAndUpdate(query, data, {
      new: true,
    });
    if (updatedTicketInfo && Object.keys(updatedTicketInfo).length !== 0)
      return res
        .status(200)
        .json({ status: "success", data: updatedTicketInfo });
    return res
      .status(400)
      .json({ status: "failure", message: "data not updated in DB." });
  } catch (err) {
    console.log("catch exception in update ticket --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};

exports.deleteTicketInfoById = async (req, res, next) => {
  try {
    const query = { ticket_id: req.params.ticketId };
    if (!query.ticket_id) {
      res.status(400).json({ status: "failure", message: "Bad request." });
    }
    await ticketSchema.deleteOne(query);
    return res
      .status(200)
      .json({ status: "Success", message: "Ticket deleted successfully." });
  } catch (err) {
    console.log("catch exception in delete ticket --->", err);
    return res.status(400).json({ status: "failure", message: err.message });
  }
};
