const mongoose = require("mongoose");
const { Schema } = mongoose;
const { v4: uuid } = require("uuid");

const customerSchema = new Schema({
  customer_id: {
    type: String,
    required: true,
    index: true,
  },
});

customerSchema.set("timestamps", true);

module.exports = mongoose.model("Customer", customerSchema);
