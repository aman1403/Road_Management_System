const mongoose = require("mongoose");

const forgotPasswordSchema = mongoose.Schema({
  userID:  {type: String},
  rand : {type:Number}
},{collection: 'forgotpassword'});

module.exports = mongoose.model("Fpass", forgotPasswordSchema);
