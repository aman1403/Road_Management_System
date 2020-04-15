const express = require('express');
const morgan = require('morgan');
var cookieParser = require('cookie-parser');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const userRoutes = require("./routes/users");
const messRoutes = require("./routes/mess");
const resourcesRoutes = require("./routes/resources");
const session = require('express-session');
const passport = require('passport');
const JWT = require('jsonwebtoken');
const User = require('./models/user');
const decode = require('jwt-decode');
const bcrypt = require("bcryptjs");
const path = require("path");
const { JWT_SECRET } = require('./configuration');
const config =  require('./configuration');
const passportJWT = passport.authenticate('jwt', { session: false });
const fPass = require('./models/forgotPassword');
const multer= require('multer');
const Document = require('./models/documents');
let fs = require('fs-extra');
const Course = require('./models/resources');
const Student = require('./Student Council/models/pro');
const complaintsRoutes = require('./routes/complaints');
const UsersController = require('./controllers/users');
var GoogleAuth = require('google-auth-library');
const checkAuth = require("./middleware/check-auth");
var auth = new GoogleAuth();
mongoose.Promise = global.Promise;
const Email = require('./models/emails');
const app = express();
const complaintEmail = require('./controllers/complaintEmail'); 
const Complaint = require('./models/complaint');
const Dashboard = require('./models/feedback');
var fcm = require('fcm-notification');
var FCM = new fcm('./controllers/privateKey.json');
const {check, validationResult } = require('express-validator');
if (process.env.NODE_ENV === 'test') {
  mongoose.connect("mongodb+srv://sonusourav:sonusourav@instigo-server-ytfvu.gcp.mongodb.net/test?retryWrites=true&w=majority", { useNewUrlParser: true });
} else {
  mongoose.connect("mongodb+srv://aluthra1403:aluthra1403@cluster0-qsree.mongodb.net/test?retryWrites=true&w=majority",{useNewUrlParser: true })
  .then(() => {
    console.log("Connected to database!");
  })
  .catch((err) => {
   console.log(err);
    console.log("Connection failed!");
  });
}
// Middlewares moved morgan into if for clear tests
if (!process.env.NODE_ENV === 'test') {
  app.use(morgan('dev'));
}
app.use(bodyParser.json({limit: "50mb"}));
app.use(bodyParser.urlencoded({limit: "50mb", extended: true, parameterLimit:50000}));
app.use(cookieParser());

app.use((req, res, next) => {
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader(
    "Access-Control-Allow-Headers",
    "Origin, X-Requested-With, Content-Type, Accept, Authorization"
  );
  res.setHeader(
    "Access-Control-Allow-Methods",
    "GET, POST, PATCH, PUT, DELETE, OPTIONS"
  );
  next();
});
// app.use(session({name:'aman',secret: 'aman',saveUninitialized: false,resave: false,store: new MongoStore({ url:
//   "mongodb+srv://sonusourav:mongopass@instigo-server-ytfvu.gcp.mongodb.net/api?retryWrites=true&w=majority",
//                       ttl: 10 * 365 * 24 * 60 * 60 }),cookie:{maxAge: 10 * 365 * 24 * 60 * 60*1000}}));
//Routes
app.use('/instigo/images', express.static( 'instigo/images'));
app.use(express.static('assets'));
app.use("/images", express.static('images'));
app.use("/resources", express.static(__dirname + "/resources"));
app.set('view engine','ejs');
app.get('/',(req,res) =>{
  Dashboard.findOne({contractCompleted:'500'}).then(result=>{
  res.render('home',{data:result});
  });
});
var client = new auth.OAuth2(config.google.clientID,config.google.clientSecret);
const storage = multer.diskStorage({
  
  destination: function(req, file, cb) {
    var tok = decode(req.headers.authorization.split(" ")[1]);
    // const url = req.protocol + "://" + req.get("host");
     let path = './images/'+tok.email;
      fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function(req, file, cb) {
    var tok = decode(req.headers.authorization.split(" ")[1]);
    cb(null, 'profilePic_' + file.originalname);
  }
});
const storage1 = multer.diskStorage({
  destination: function(req, file, cb) {
    var tok = decode(req.headers.authorization.split(" ")[1]);
     let path = './images/'+tok.email;
      fs.mkdirsSync(path);
    cb(null, path);
  },
  filename: function(req, file, cb) {
    var tok = decode(req.headers.authorization.split(" ")[1]);
    cb(null, 'coverPic_' + file.originalname);
  }
});
const fileFilter = (req, file, cb,res) => {
  // reject a file
  if (file.mimetype === 'image/jpeg' || file.mimetype === 'image/png') {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
const upload = multer({
  storage: storage,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});
const upload1 = multer({
  storage: storage1,
  limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
});
const storage2 = multer.diskStorage({
  destination: function(req, file, cb) {
     var tok = decode(req.headers.authorization.split(" ")[1]);

    let path = './images/'+tok.email;
      fs.mkdirsSync(path);
    cb(null, './images/'+tok.email);
  },
  filename: function(req, file, cb) {
    var tok = decode(req.headers.authorization.split(" ")[1]);
    cb(null,file.originalname);
  }
});
const upload2 = multer({
  storage: storage2,
  limits: {
    fileSize: 1024 * 1024 *10
  }
});

app.use(function(req, res, next){
  next();
});
app.post('/reset',[check('password','password must be in 6 characters').isLength({min:6})],(req,res)=>{
  console.log(req.cookies.auth);
  var token = req.cookies.auth;
  // decode token
  //cookies.set('testtoken', {expires: Date.now()});
  if (token) {
    JWT.verify(token,JWT_SECRET,function(err, token_data) {
      if (err) {
         return res.status(403).send({message: 'Link has been expired!'});
      } else {
            var tok = decode(token);
              console.log(tok);
               const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).json({ errors: errors.array() });
  }
    var password = req.body.password;
    var confirm = req.body.confirm;
    if (password !== confirm ) return res.status(200).json({ message: "password do not match" });
     if (password === "" ) return res.status(200).json({ message: "password can't be empty" });
else {
 bcrypt.hash(password, 10).then(hash =>{
  console.log(tok.email);
      User.findOne({'email': tok.email }).then(user =>{
    var currentdate = new Date(); 
var datetime =currentdate.getTime();
    user.password = hash;
    user.updatedPass = datetime;
    user.save().then(result=>{
      console.log("Amanna"+tok.email);
       fPass.deleteOne({"rand": req.body.nam}).catch(error => {
          console.log(error);
        });
      res.status(200).json({ message: "successfully Updated Password"});
    })
    .catch(error => {
      res.status(200).json({
        message: "failure@err in Updating"
      });
    });
    })
    .catch(error => {
      res.status(500).json({
        message: "User not found!"
      });
    });
      });
    };
  }
  });
}
else {
    return res.status(403).send('Link has been Expired');
  };
});
app.post('/updatepassword',checkAuth,(req,res)=>{
    var password = req.body.password;
     if (password === "" ) return res.status(200).json({ message: "failure@Password can't be empty" });
else {
 bcrypt.hash(password, 10).then(hash =>{
  var tok = decode(req.headers.authorization.split(" ")[1]);
  console.log(tok);
   User.findOne({'_id': tok.id }).then(user =>{
     var currentdate = new Date(); 
var datetime = currentdate.getDate() + "-"
                + (currentdate.getMonth()+1)  + "-" 
                + currentdate.getFullYear() + " "  
              + currentdate.getHours() + ":"  
                + currentdate.getMinutes() + ":" 
                + currentdate.getSeconds();
var dateString = datetime,
    dateTimeParts = dateString.split(' '),
    timeParts = dateTimeParts[1].split(':'),
    dateParts = dateTimeParts[0].split('-'),
    date;

date = new Date(dateParts[2], parseInt(dateParts[1], 10) - 1, dateParts[0], timeParts[0], timeParts[1]);


 //1379426880000
 var datetime1 = date.getTime();
    user.password = hash;
    updatepassword = datetime1;
    user.updatedPass = datetime1;
    user.save().then(result=>{
      console.log('Aman');
      res.status(200).json({ message: "success",passLastUpdated: updatepassword });
    })
    .catch(error => {
    
      res.status(200).json({
        message: "failure@err in Updating"
      });
    });
    })
    .catch(error => {
      res.status(200).json({
        message: "failure@User not found!"
      });
    });
 });
};
});
app.get('/forgotp/:id1/:id',(req,res)=>{
  console.log(req.params.id1);
    fPass.findOne({'rand':req.params.id1}).then(result =>{
      console.log(result);
      if(!result){
        res.status(403).json({message : "password already Updated"});
      }else{
      res.cookie('auth',req.params.id);
    res.render('email',{id1:req.params.id1});}
    });
})
// // app.get('/auth/google', passport.authenticate('google', {
// //   scope: ['profile', 'email']
// // }) 
// );
app.get('/logout', function(req, res){
    req.logout();
    res.status(200).json({message:"success"});
  //   if(req.session.user === null){
  //    res.status(200).json({message:"failure@Already Logged Out"});
  //   }
  //   else{ req.session.user = null;
  //   res.status(200).json({message:"success"});
  // }
  });

const upload4= multer({
    // const url = req.protocol + "://" + req.get("host");
    storage:storage
}).single('profilepic')

app.post('/profilepic',checkAuth,(req,res) => {
  var tok = decode(req.headers.authorization.split(" ")[1]);

    upload4(req, res, function (err) {
        
        if (err) {

            res.status(400).json({message: err.message})

        } else {
          let path =req.protocol+'://'+req.get("host")+'/'+'images/'+tok.email+'/'+req.file.filename;
          User.updateOne({'_id': tok.id },{'profilePic':path}).then(result =>{
    
  if (result.n > 0) {
      res.status(200).json({ message: "success" });
      }else {
        res.status(200).json({ message: "failure@err in Updating pic" });
      }
    })
    .catch(error => {
      res.status(200).json({
        message: "User not found!"
      });
    });
        }
    })
});
const upload3= multer({
    // const url = req.protocol + "://" + req.get("host");
    storage:storage1
}).single('coverpic')

app.post('/coverpic',checkAuth,(req, res)=>{
  var tok = decode(req.headers.authorization.split(" ")[1]);

    upload3(req, res, function (err) {
       
        if (err) {

            res.status(400).json({message: err.message})

        } else {
          let path =req.protocol+'://'+req.get("host")+'/'+'images/'+tok.email+'/'+req.file.filename;
          User.updateOne({'_id': tok.id },{'coverPic':path}).then(result =>{
  
  if (result.n > 0) {
      res.status(200).json({ message: "success" });
      }else {
        res.status(200).json({ message: "failure@err in Updating pic" });
      }
    })
    .catch(error => {
      res.status(200).json({
        message: "User not found!"
      });
    });
        }
    })
});
function getExt(filename)
{
    var ext = filename.split('.').pop();
    if(ext == filename) return "";
    return ext;
}
const upload5= multer({
    // const url = req.protocol + "://" + req.get("host");
    storage:storage2,
    limits: {
    fileSize: 1024 * 1024 * 10
  },
  fileFilter: fileFilter
}).single('document');
app.post('/documents',(req,res) => {
  var tok = decode(req.headers.authorization.split(" ")[1]);
  console.log(tok+"Bosh");

   upload5(req, res, function (err) {
         
        if (err) {
            
            res.status(200).json({message: err.message})

        } else {
  User.findOne({'_id':tok.id}).then(user =>{
   const documents= new Document({ 
    docTitle:req.body.docTitle,
    by:user.name,
    profileUrl:user.profilePic,
    file:req.file.filename,
    length:req.body.length,
    width:req.body.width,
    thickness:req.body.thickness,
    material:req.body.material,
    location:req.body.location,
    roadPic:req.protocol+'://'+req.get("host")+'/'+'images/'+tok.email+'/'+req.file.filename
    });
    documents.save().then(result=>{
    console.log(result);
    var status = (req.body.length/100);
      Dashboard.updateOne({
                  "contractCompleted": '500',
                  "Contractors.name": documents.by
                },{"$set": {
                  "Contractors.$.status": status 
                }}, (err,result) => {
                  if (err){
                    console.log("error in updating accepted");
                  } else{      
                    console.log(result);
                  }
                })
    res.status(200).json({message:"success"});
  });
 });
}
})
 });
app.get('/secys',function (req,res) {
    Student.find({}).then(students =>{
     console.log(students);
      if(students){res.status(200).json(students);}
      else{res.status(200).json({message : "failure@Err in getting secys"});}
    });
});
app.get('/download/:id/:id1', function(req, res){
  const file = `${__dirname}/resources/${req.params.id}/${req.params.id1}`;
  res.download(file); // Set disposition and send it.
});
app.use('/users', userRoutes);
app.use('/mess', messRoutes);
app.use('/courses',resourcesRoutes);
app.use('/complaints',complaintsRoutes);
app.get('/tokensignin/:id',(req,res,next)=>{
  const token =req.params.id;
  console.log(token+"token");
 const audience = config.google.clientID;
   var verifyToken = new Promise(function(resolve, reject) {
            client.verifyIdToken(
                token,
                audience,
                function(e, login) { 
                    if (login) {
                        var payload = login.getPayload();
                        var googleId = payload['sub'];
                        var email = payload['email'];
                        var name = payload['name'];
                        var picture = payload['picture'];
                        resolve(googleId);   
                        User.findOne({ 'email' : email}, function(err, user) {
                    if (user) {  const token = JWT.sign(
                             { id: user._id ,email:user.email,name:user.name,profilePic:user.profilePic},
                               JWT_SECRET,
                                 { expiresIn: "31536000h" }
                              );
              res.status(200).json({message:"success",userId:token,level:user.level});
          } else {
            var newUser = {
              email:email,
              socialId: googleId,
              password:'$2a$10$LGvwGlOq9.2ahUvfRdypj.EddTci2pGmRyVL21to8L/vTyDovHiZa',
              name:name,
              profilePic:picture,
              isEmailVerified:true
            };
        Email.findOne({"email":newUser.email}).then(user1=>{
          if (user1) {
            User.create(newUser, function(err, added) {
              const token = JWT.sign(
               { _id:newUser._id ,email:newUser.email,name:newUser.name,profilePic:newUser.profilePic},
                               JWT_SECRET,
                                 { expiresIn: "31536000h" }
                              );
                if (err) {
                  console.log(err);
                }
                 res.status(200).json({message:"success",userId:token,level:user1.level});
            });
          }
          else{
             User.create(newUser, function(err, added) {
              const token = JWT.sign(
               { _id:newUser._id,email:newUser.email},
                               JWT_SECRET,
                                 { expiresIn: "31536000h" }
                              );
                if (err) {
                  console.log(err);
                }
                 res.status(200).json({message:"success",userId:token});
            });
          }
        });
          }
        });
                  } else {
                        reject("invalid token");
                    }
                })
          })
        .catch(function(err) {
            res.send(err);
        })
    })
app.post('/complaints/:id',(req,res,next) => {
  var tok = decode(req.headers.authorization.split(" ")[1]);
  var id = req.params.id;
  var currentdate = new Date(); 
  var datetime = currentdate.getMonth()+" "+currentdate.getDate() +"," 
  +currentdate.getFullYear()+"\n"+currentdate.toLocaleTimeString('en-GB', { hour: "numeric",minute: "numeric"});        
    User.findOne({"_id":tok.id}).then(user =>{
      const complaint = new Complaint({
    comments:req.body.comments,
    requestorName:user.name,
    requestorUrl:user.profilePic,
    roadId:id,
    length:req.body.length,
    requestorEmail:tok.email,
    width:req.body.width,
    dateCreated:datetime,
    status:0
    });
        console.log(complaint);
       complaint.save().then(result=>{
        console.log(result+"Amanji");
      user.mycomplaints.push(complaint._id);
        user.badges = user.mycomplaints.length;
        user.reputation = user.reputation + 10;
      user.save();
      console.log(req.params.id);
       Document.findOne({_id:req.params.id}).then(result1=>{
        console.log(result1+"wow");
          result1.ids.push(complaint._id);
          result1.save().then(resul=>{
            console.log(result1+"Amanww");
              Dashboard.updateOne({
                  "contractCompleted": '500',
                  "Contractors.name": result1.by
                },{"$set": {
                  "Contractors.$.issues": result1.ids.length
                }}, (err,result2) => {
                  if (err){
                    console.log("error in updating accepted");
                  } else{      
                    console.log(result2);
                  }
                })
      });
             });
        var token = user.fcmToken; 
      if(token){
         var message = {
        data: { 
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
    req.userID =tok.email;
    Complaint.find({})
    .then(documents => {
      return Complaint.count({});
    })
    .then(count => {
      console.log(count);
        Dashboard.updateOne({contractCompleted:'500'},{"totalIssue":count}).then(result =>{console.log(result)});
   }); 
   return complaintEmail.complaintemail(req,res,next); 
 });
  });
app.get('/documents', function(req, res){
 Document.find({}).then(complaints =>{
  res.status(200).json({posts:complaints});
  });
  });
app.post('/documents/comments/:id', function(req, res){
Document.findOne({'_id':req.params.id}).then(document1 =>{
  var currentdate = new Date(); 
  var datetime = currentdate.getMonth()+" "+currentdate.getDate() +"," 
  +currentdate.getFullYear()+"\n"+currentdate.toLocaleTimeString('en-GB', { hour: "numeric",minute: "numeric"});
var tok = decode(req.headers.authorization.split(" ")[1]);
        const commen = { 
                comment:req.body.comment,
                by:tok.name,
                url:tok.profilePic,
                date:datetime,
                email:tok.email
              }
              console.log(document1);
              document1.comments.push(commen);
              document1.commentsList =document1.commentsList + 1;
              document1.save().then(result=>{
                console.log("Added"+result);
                res.send(commen);
              });
            });
  });
app.put('/documents/upvotes/:id', function(req, res){
 Document.findOne({'_id':req.params.id}).then(complaints =>{
     complaints.upvote = !(complaints.upvote);
     if(complaints.upvote == true){
      complaints.upvotes++;
     }
     else{
      complaints.upvotes--;
     }
     complaints.save().then(result=>{
      console.log(result);
      res.status(200).json({message:"success"});
     });
  });
  });
//Aman 
app.put('/documents/downvotes/:id', function(req, res){
  Document.findOne({'_id':req.params.id}).then(complaints =>{
     complaints.downvote = !(complaints.downvote);
     if(complaints.downvote == true){
      complaints.downvotes++;
     }
     else{
      complaints.downvotes--;
     }
      complaints.save().then(result=>{
      console.log(result);
      res.status(200).json({message:"success"});
     });
 });
});
app.get('/complaints/:id', function(req, res){
 User.findOne({'_id':req.params.id}).then(user =>{
  res.status(200).json({posts:user.mycomplaints});
  });
  });
app.get('/dashboard', function(req, res){
res.status(200).json({message:"success"});
  });
module.exports = app;