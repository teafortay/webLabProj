const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: String,
  googleid: String,
  money: Number,
  location: Number,
});

// compile model from schema
module.exports = mongoose.model("player", PlayerSchema);
