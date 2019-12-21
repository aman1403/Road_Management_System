var mongoose = require('mongoose');
var Schema = mongoose.Schema;

///////////----->making Schema for Students Information
var schema = new Schema({
	teamName:{type:String},
	teamDesc:{type:String},
	teamSize:{type:String},
	teamUrl:{type:String},
	team:[{imagePath:{type:String},
	title:{type:String ,required:true},
	name:{type:String ,required:true},
	email:{type:String ,required:true},
	phoneno:{type:Number,required:true},
	desc:{type:String ,required:true}}]
	
});

///////------>Exporting the schema for using in another file
module.exports = mongoose.model('Student',schema);