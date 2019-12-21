var mongoose = require('mongoose');
const Dashboard = require('../models/feedback');
mongoose.connect("mongodb+srv://aluthra1403:aluthra1403@cluster0-qsree.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
    console.log(err);
    console.log("Connection failed!");
  });
var contractors = [
  {imagePath:"http://instigo-project.appspot.com/images/sonusouravdx001@gmail.com/profilePic_final-min.JPG",
	name:'John Doe',
	location:'Roorkee',
	status:'0',
},

	{imagePath:"https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiuotDK68XmAhUCeysKHcA4ApwQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fbeauty%2F&psig=AOvVaw2wlAiAD3wF1r3uvmJIklLU&ust=1576986750384701",
	title:'Hostel 2 Secy',
	name:'Numpy',
	email:'170030039@iitdh.ac.in',
	phoneno:'9999999999',
	desc: 'Cs 2nd Year'},

	{imagePath:"https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiuotDK68XmAhUCeysKHcA4ApwQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fbeauty%2F&psig=AOvVaw2wlAiAD3wF1r3uvmJIklLU&ust=1576986750384701",
	title:'Hostel 3 Secy',
	name:'Numpy',
	email:'170030039@iitdh.ac.in',
	phoneno:'9999999999',
	desc: 'Cs 2nd Year'},

	{imagePath:"https://www.google.com/url?sa=i&source=images&cd=&ved=2ahUKEwiuotDK68XmAhUCeysKHcA4ApwQjRx6BAgBEAQ&url=https%3A%2F%2Fwww.pexels.com%2Fsearch%2Fbeauty%2F&psig=AOvVaw2wlAiAD3wF1r3uvmJIklLU&ust=1576986750384701",
	title:'Hostel 4 Secy',
	name:'Numpy',
	email:'170030039@iitdh.ac.in',
	phoneno:'9999999999',
	desc: 'Cs 2nd Year'}	
];
Dashboard.updateOne({contractCompleted:"500"},{Contractors:contractors}).then(dashboard =>{
	console.log(dashboard);
	exit();
	});
function exit(){
	mongoose.disconnect();
}