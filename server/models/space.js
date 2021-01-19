const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  name: String,
  owner: String,
  price_per_hotel: Number,
  color: String,

});

// compile model from schema
module.exports = mongoose.model("space", SpaceSchema);
