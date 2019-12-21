const User = require('../models/user');
const Product = require('../models/menu');
const Feedback = require('../models/feedback');
const decode = require('jwt-decode');
module.exports = {
	getmenu :async(req,res,next) =>{
	Product.find({}).then(prods =>{
		console.log(prods);
    // res.status(200).json({menu: prods}); 
    res.send(prods);
	});
},
createFeedback: async(req,res,next) =>{
	// if (!req.session.user) {
 //    res.json({message : "Not Authorized"});}
 var tok = decode(req.headers.authorization.split(" ")[1]);
 	User.findOne({'_id':tok.id}).then(user=>{
	const feedback = new Feedback({ 
		day:req.body.day,
		desc:req.body.desc,
		part:req.body.part,
		ratings:req.body.ratings,
		title:req.body.title,
		username:user.name,
		url:user.profilePic
	});
	console.log(feedback);
	 feedback.save().then(result=>{
	 	if(result)res.status(200).json({message:"success",feedback:feedback});
	 	else{res.status(200).json({message:"failure@err in posting feedback"})}
	 });
	});
},
getFeedback: async(req,res,next) =>{
	// console.log("aman");
	// if (!req.session.user) {
 //    res.json({message : "failure@Not Authorized"});}
    
    	Feedback.find({}).then(feedbacks =>{
    		console.log(feedbacks);
    		return res.status(200).json({feedbacks:feedbacks});
    });
},
ratings: async(req,res,next) =>{
	var part = req.params.id;
	var rat = part.ratings;
	if(part === "breakfast"){
Product.findOne({"day":req.params.id1}).then(prod =>{
	var ratings = req.body.ratings + prod.breakfast.ratings;
	prod.breakfast.raters = prod.breakfast.raters + 1;
	var mean = ratings/prod.breakfast.raters;
	prod.breakfast.ratings = mean;
	prod.save().then(result =>{
		if(result){res.status(200).json({message:"success",ratings:mean});}
		else{res.status(200).json({message:"failure@err in ratings"});}
	});
});
}
if(part === "lunch"){
Product.findOne({"day":req.params.id1}).then(prod =>{
	var ratings = req.body.ratings + prod.lunch.ratings;
	prod.lunch.raters = prod.lunch.raters + 1;
	var mean = ratings/prod.lunch.raters;
	prod.lunch.ratings = mean;
	prod.save().then(result =>{
		if(result){res.status(200).json({message:"success",ratings:mean});}
		else{res.status(200).json({message:"failure@err in ratings"});}
	});
});
}
if(part === "snacks"){
Product.findOne({"day":req.params.id1}).then(prod =>{
	var ratings = req.body.ratings + prod.snacks.ratings;
	prod.snacks.raters = prod.snacks.raters + 1;
	var mean = ratings/prod.snacks.raters;
	prod.snacks.ratings = mean;
	prod.save().then(result =>{
		if(result){res.status(200).json({message:"success",ratings:mean});}
		else{res.status(200).json({message:"failure@err in ratings"});}
	});
});
}
if(part === "dinner"){
Product.findOne({"day":req.params.id1}).then(prod =>{
	var ratings = req.body.ratings + prod.dinner.ratings;
	prod.dinner.raters = prod.dinner.raters + 1;
	var mean = ratings/prod.dinner.raters;
	prod.dinner.ratings = mean;
	prod.save().then(result =>{
		if(result){res.status(200).json({message:"success",ratings:mean});}
		else{res.status(200).json({message:"failure@err in ratings"});}
	});
});
}
}
}