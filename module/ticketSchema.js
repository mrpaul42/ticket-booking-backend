const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuid } = require("uuid");

const ticketSchema = new Schema({
  ticket_id: {
    type: String,
    index: true,
    default: "TIX_" + uuid(),
  },
  customer_name: {
    type: String,
    required: true,
  },
  customer_id: {
    type: String,
    required: true,
    index: true,
  },
  movie_title: {
    type: String,
    require: true,
  },
  movie_time: {
    type: Date,
    required: true,
  },
  ticket_price: {
    type: Number,
    required: true,
  },
});

ticketSchema.set("timestamps", true);

module.exports = mongoose.model("Ticket", ticketSchema);
