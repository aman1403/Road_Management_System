var mongoose = require('mongoose');
var Schema = mongoose.Schema;
// var currentDate = new Date();
// var date = currentDate.getDate();
// var month = currentDate.getMonth(); //Be careful! January is 0 not 1
// var year = currentDate.getFullYear();
// var dateString = date + "-" +(month + 1) + "-" + year;
var currentdate = new Date(); 
var datetime = currentdate.getDate() + "/"
                + (currentdate.getMonth()+1)  + "/" 
                + currentdate.getFullYear() + " "  
                + currentdate.toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"});
var schema = new Schema({
	totalIssue:{ type:String,default: datetime, required: true },
	issueRecieved:{type:Number,default:0},
	avgProgress:{type:Number,default:0},
	contractCompleted:{type:Number,default:500},
	Contractors:{type:[{name:{type:String,default:null},location:{type:String,default:null},status:{type:String,default:null},imagePath:{type:String},issues:{type:Number,default:0}}]}
});
module.exports = mongoose.model('dashboard',schema);