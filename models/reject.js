const mongoose = require("mongoose");
const rejectEmailSchema = mongoose.Schema({
  userID: { type: String, required: true },
  rand : {type: Number}
},{collection: 'rejectemails'});

module.exports = mongoose.model("Remail", rejectEmailSchema);