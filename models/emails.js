const mongoose = require("mongoose");

const EmailSchema = mongoose.Schema({
  email:  {type: String},
  level: {type:Number}
},{collection: 'emails'});

module.exports = mongoose.model("Email", EmailSchema);
