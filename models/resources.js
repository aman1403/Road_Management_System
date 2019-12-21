var mongoose = require('mongoose');
const uniqueValidator = require("mongoose-unique-validator");
var Schema = mongoose.Schema;
var schema = new Schema({
  courseName:{type:String},
  branch:[{type:String}],
  courseCode:{type:String,unique: true},
  documents:[{type: mongoose.Schema.Types.ObjectId, ref: "Document"}]
});

schema.plugin(uniqueValidator);
module.exports = mongoose.model('Course',schema);