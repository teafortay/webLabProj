const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  _id: Number,
  space_id: Number,
  name: String,
  owner: String,
  ownerId: String,
  numberOfBooths: Number,
  

});

// compile model from schema
module.exports = mongoose.model("space", SpaceSchema);
