var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var schema = new Schema({
  status:{type:Number,default:0},
  dateCreated:{type:String,default:null},
  requestorName:{type:String},
  requestorUrl:{type:String},
  comments:{type:String},
  requestorEmail:{type:String},
  roadId:{type:String},
  length:{type:String},
  width:{type:String},
  thickness:{type:String},
  material:{type:String}
});
module.exports = mongoose.model('Complaint',schema);