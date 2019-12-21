const mongoose = require("mongoose");

const verifyEmailSchema = mongoose.Schema({
  userID: { type: String, required: true },
  rand : {type: Number}
},{collection: 'verifyemails'});

module.exports = mongoose.model("Vemail", verifyEmailSchema);
