const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  name: String,
  owner: String,
  numberOfBooths: Number,
  

});

// compile model from schema
module.exports = mongoose.model("space", SpaceSchema);
