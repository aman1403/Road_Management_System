var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var schema = new Schema({
	breakfast:{time:{type:String},item:{type:String},raters:{type:Number},ratings:{type:Number,default:0}},
	lunch:{time:String,item:String,raters:Number,ratings:{type:Number,default:0}},
	snacks:{time:String,item:String,raters:Number,ratings:{type:Number,default:0}},
	dinner:{time:String,item:String,raters:Number,ratings:{type:Number,default:0}},
	day:{type:Number}
});
module.exports = mongoose.model('Product',schema);