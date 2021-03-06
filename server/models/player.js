const mongoose = require("mongoose");

const PlayerSchema = new mongoose.Schema({
  name: String,
  userId: String,
  money: Number,
  location: Number,
  isTurn: Boolean,
  didStartTurn: Boolean,
  ghost: Boolean,
  jailTurns: Number,
});

// compile model from schema
module.exports = mongoose.model("player", PlayerSchema);
