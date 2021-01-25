const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  _id: Number,
  name: String,
  owner: String,
  numberOfBooths: Number,
  

});

// compile model from schema
module.exports = mongoose.model("space", SpaceSchema);
