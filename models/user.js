const mongoose = require('mongoose');
const bcrypt = require("bcryptjs");
const userSchema =mongoose.Schema({
  email: { type: String,  lowercase: true },
  password: { type: String, default: null },
  name: { type: String},
  isEmailVerified: {  type: Boolean,default: false },
  profilePic: { type: String,default: null },
  coverPic: { type: String, default: null},
  phone:{type:Number,default:null},
  mycomplaints:[{type: mongoose.Schema.Types.ObjectId, ref: "Complaint"}],
  badges:{type:Number},
  fcmToken:{type:String,default:null},
  reputation:{type:Number,default:0},
  level:{type:Number,default:0}
});
module.exports  = mongoose.model("User", userSchema);