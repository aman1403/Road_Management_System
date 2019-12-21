const User = require('../models/user');
const Complaint = require('../models/complaint');
const Student = require('../Student Council/models/pro');
const complaintEmail = require('./complaintEmail'); 
const decode = require('jwt-decode');
const warden = require('./warden.js');
// var fcm = require('fcm-notification');
// var FCM = new fcm(__dirname+'/privateKey.json');
function myFunction(zeros) {
	 var zeroes = "";
	  for (var i = zeros; i >0; i--) {
           zeroes+="0";
               }
               return zeroes; 
	} 
 var currentdate = new Date(); 
 const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun",
  "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
];
var datetime = monthNames[currentdate.getMonth()]+" "+currentdate.getDate()
                +"," 
                +currentdate.getFullYear()+"\n"+currentdate.toLocaleTimeString('en-GB', { hour: "numeric", 
                                             minute: "numeric"}); 
module.exports = {
	getcomplaints:async(req,res,next) =>{
	Complaint.find({isPrivate:false}).then(complaints =>{
		
    // res.status(200).json({menu: complaints}); 
    res.send(complaints);
	});
},
	secyComplaints:async(req,res,next) =>{
		Complaint.find({}).then(complaints =>{
		
    // res.status(200).json({menu: complaints}); 
    res.send(complaints);
	});
	},
	wardenComplaints:async(req,res,next) =>{
		Complaint.find({status: {$gte : req.params.id}}).then(complaints =>{
	
    res.send(complaints);
	});
	},
mycomplaints:async(req,res,next) =>{
	 var tok = decode(req.headers.authorization.split(" ")[1]);
	User.findById(tok.id).populate('mycomplaints').then(user =>{
		
    res.send(user.mycomplaints);
	}).catch(error =>{
		console.log(error);
		res.status(200).json({message:"failure_user not found"});
	});			
},
postcomplaints :async(req,res,next) =>{
var tok = decode(req.headers.authorization.split(" ")[1]);       
var id = req.body.related.slice(0,3).toUpperCase()+currentdate.getFullYear();
	 	User.findOne({"_id":tok.id}).then(user =>{
	 		const complaint = new Complaint({ 
		houseNo:req.body.houseNo,
		requestDesc:req.body.requestDesc,
		requestorName:req.body.requestorName,
		requestorUrl:user.profilePic,
		hostelNo:req.body.hostelNo,
		requestName:req.body.requestName,
		isPrivate:req.body.isPrivate,
		isPriority:req.body.isPriority,
		related:req.body.related,
		requestId:id,
		requestorEmail:tok.email,
		dateCreated:datetime,
		status:1
    });
	 	var st ="Opened by "+req.body.requestorName;
	 	complaint.trackStatus.push(st);
	 		 complaint.statusDate.push(datetime);
	 		 complaint.save().then(result=>{
	 		 	console.log(result);
	 		user.mycomplaints.push(complaint._id);
	 		user.save().then(result=>{
	 			console.log("Added"+result);
	 		});
	 			var token = user.fcmToken;
	 		
	 		if(token){
	 			 var message = {
        data: {    //This is only optional, you can send any data
            score: '850',
            time: '2:45'
        },
        notification:{
            title : 'New Complaint',
            body : "Your Complaint id"+" "+id+" "+'successfully registered' 
        },
        token : token
        };
FCM.send(message, function(err, response) {
    if(err){
        console.log('error found', err);
    }else {
        console.log('response here', response);
    }
});
	 		}
	 			 	});
	 		// var token1 = "fbIEam_6qmM:APA91bHnqA1rGyEMZ3jP6QkK8ZQ8b60OZnFDq9LqXQGCE6K3gU3l75HWnSxPQdpDAS8zkSel_ADMQmyJNdvHK3iLqbtESIztA_Gddk0O7PkxEev5l6P_FBUqmN14RYqBHYCYkQe-FEAK";
	 				Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+req.body.hostelNo+' '+'Secy';
	 					// let result= team[0].team.filter(x => x.title === comp);
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 			
	 					req.userID = "instigo.iitdh@gmail.com";
	 					req.userID1=result[0].email;
	 					User.find({'email':"170030039@iitdh.ac.in",'email':result[0].email}).then(users=>{
	 						console.log(users);
	 					})
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	 		 
	 	// if(result)res.status(200).json({message:"success"});
	 	// else{res.status(200).json({message:"failure_err in posting feedback"})}
	 });  
},
	validcomplaints: async(req,res,next) =>{
			Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
							complaint.status =2;
							var st ="Validated by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
								
							});
						Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+complaint.hostelNo+' '+'Secy';
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 					
	 					req.userID =complaint.requestorEmail;
	 					req.userID1=result[0].email;
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	});
},
notvalidcomplaints: async(req,res,next) =>{
			Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
  						console.log(complaint);
							complaint.status =0;
							var st ="Rejected by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
								
							});
	 					req.userID =complaint.requestorEmail;
	 					return complaintEmail.rejectemail(req,res,next);				
	});
},
onGoing:  async(req,res,next) =>{
		Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
							complaint.status =5;
							var st ="Work ongoing";
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
								
							})
						Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+complaint.hostelNo+' '+'Secy';
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 					console.log(result[0]);
	 					req.userID =complaint.requestorEmail;
	 					req.userID1=result[0].email;
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	});
	},
	resolved:  async(req,res,next) =>{
		Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
							complaint.status =6;
							var st ="Work Resolved";
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
								
							})
						Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+complaint.hostelNo+' '+'Secy';
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 					console.log(result[0]);
	 					req.userID =complaint.requestorEmail;
	 					req.userID1=result[0].email;
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	});
	},
	wardenDisapproval: async(req,res,next) =>{
			Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
  						console.log(complaint);
							complaint.status =0;
							var st ="Rejected by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
								
							});
	
	 					req.userID =complaint.requestorEmail;
	 					return complaintEmail.rejectemail(req,res,next);				
	});
},

	wardenVerification:  async(req,res,next) =>{
		Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
							complaint.status =3;
							var st ="Approved by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
							
							})
						Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+complaint.hostelNo+' '+'Secy';
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 					console.log(result[0]);
	 					req.userID =complaint.requestorEmail;
	 					req.userID1=result[0].email;
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	});
	},
	ipsDisapproval: async(req,res,next) =>{
			Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
  						console.log(complaint);
							complaint.status =0;
							var st ="Rejected by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
							
							});
	
	 					req.userID =complaint.requestorEmail;
	 					return complaintEmail.rejectemail(req,res,next);				
	});
},
	ipsVerification:  async(req,res,next) =>{
		Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
							complaint.status =4;
							var st ="Forwarded by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{			
							})
						Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+complaint.hostelNo+' '+'Secy';
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 					console.log(result[0]);
	 					req.userID =complaint.requestorEmail;
	 					req.userID1=result[0].email;
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	});
	},
	close:  async(req,res,next) =>{
		Complaint.findOne({'requestId':req.params.id}).then(complaint =>{		
  			var tok = decode(req.headers.authorization.split(" ")[1]);
							complaint.status =7;
							var st ="Closed by "+tok.name;
	 						complaint.trackStatus.push(st);
							complaint.statusDate.push(datetime);
							complaint.save().then(result=>{
							
							})
						Student.find({teamName:"Hostel Secys"}).then(team=>{
	 					  var comp ='Hostel'+' '+complaint.hostelNo+' '+'Secy';
	 					var result = team[0].team.filter(function (el) {
							  return el.title === comp;
									});
	 					console.log(result[0]);
	 					req.userID =complaint.requestorEmail;
	 					req.userID1=result[0].email;
	 					return complaintEmail.complaintemail(req,res,next);
	 				});
	});
	},
	comments:async(req,res,next)=>{
		Complaint.findOne({'requestId':req.params.id}).then(complaint =>{	
  			var tok = decode(req.headers.authorization.split(" ")[1]);
				const commen = { 
								comment:req.body.comment,
								by:tok.name,
								url:tok.profilePic,
								date:datetime,
								email:tok.email
							}
						
							complaint.comments.push(commen);
							complaint.save().then(result=>{
								console.log("Added"+result);
								res.send(commen);
							});
						});
	}
}