var Email= require('../models/emails');
var mongoose = require('mongoose');
mongoose.connect("mongodb+srv://sonusourav:sonusourav@instigo-server-ytfvu.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection failed!");
  });
var emails = [
new Email({
  email:"sonusouravdx001@gmail.com",
  level:0
}),
new Email({
  email:"170030039@iitdh.ac.in",
  level:1
}),
new Email({
  email:"aluthra1403@gmail.com",
  level:2
}),
new Email({
  email:"vluthra2504@gmail.com",
  level:3
}),new Email({
  email:"170020021@iitdh.ac.in",
  level:4
})
];

var done =0;


//////////////////------> Saving Student Information in database
	
console.log(emails);
for(var i=0; i<emails.length; i++){
	emails[i].save(function(err,result){
		if(err){console.log(err);}
		done++;
		if (done == emails.length) {
			console.log(done);
			exit();
		}
	});
}
function exit(){
	mongoose.disconnect();
}  
