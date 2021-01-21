const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  name: String,
  canOwn: Boolean,
  owner: String,
  pricePerBooth: Number,
  rentPerBooth: Number,
  numberOfBooths: Number,
  color: String,

});

// compile model from schema
module.exports = mongoose.model("space", SpaceSchema);
