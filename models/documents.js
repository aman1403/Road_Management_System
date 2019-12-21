var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;
var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});
var postscreenschema = new Schema({
  docTitle:{type:String,required:true},
  upvotes:{type:Number,default:0},
  downvotes:{type:Number,default:0},
  date:{type:String,default:datetime},
  by:{type:String},
  profileUrl:{type:String},
  file:{type:String,required:true},
  roadPic:{type:String},
  length:{type:String},
  width:{type:String},
  thickness:{type:String},
  material:{type:String},
  location:{type:String},
  upvote:{type:Boolean,default:false},
  downvote:{type:Boolean,default:false},
  ids:[{type: mongoose.Schema.Types.ObjectId, ref: "Complaint"}],
 comments:[{comment:{type:String,default:null},by:{type:String,default:null},email:{type:String,default:null},url:{type:String,default:null},date:{type:String,default:null}}],
 commentsList:{type:Number,default:0}
});
// schema.plugin(uniqueValidator);
module.exports = mongoose.model('Document',postscreenschema);