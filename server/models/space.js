const mongoose = require("mongoose");

const SpaceSchema = new mongoose.Schema({
  space_id: Number,
  owner: String,
  ownerId: String,
  numberOfBooths: Number,
  

});

// compile model from schema
module.exports = mongoose.model("space", SpaceSchema);
