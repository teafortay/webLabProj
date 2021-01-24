const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  money: Number,
  properties: Array, //list of space objects
  location: Number,
});

// compile model from schema
module.exports = mongoose.model("player", PlayerSchema);
