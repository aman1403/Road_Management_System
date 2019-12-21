const mongoose = require("mongoose");

const wardenEmailSchema = mongoose.Schema({
  userID: { type: String, required: true },
  userID1:{type: String, required: true},
  rand : {type: Number}
},{collection: 'wardenemails'});

module.exports = mongoose.model("Wemail", wardenEmailSchema);