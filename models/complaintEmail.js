const mongoose = require("mongoose");
const complaintEmailSchema = mongoose.Schema({
  userID: { type: String, required: true },
  rand : {type: Number}
},{collection: 'complaintemails'});

module.exports = mongoose.model("Cemail", complaintEmailSchema);