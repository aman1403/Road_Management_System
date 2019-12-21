const JWT = require('jsonwebtoken');
const User = require('../models/user');
const { JWT_SECRET } = require('../configuration');
const Vemail = require('../models/verifyemail')
const verifyEmail = require ('./emailVerification');
const bcrypt = require("bcryptjs");
const phone = require("phone");
const Fpass = require("../models/forgotPassword");
const decode = require('jwt-decode');
const {check, validationResult } = require('express-validator');
var randtoken = require('rand-token');
var Email= require('../models/emails');
signToken = user => {
  return JWT.sign({
    iss: 'CodeWorkr',
    sub: user.id,
    iat: new Date().getTime(), // current time
    exp: new Date().setDate(new Date().getDate() + 1) // current time + 1 day ahead
  }, JWT_SECRET);
}
module.exports = {
signUp: (req, res, next) => {
  console.log("AMnas12");
 Email.findOne({"email":req.body.email}).then(user1=>{
  if(user1){
     bcrypt.hash(req.body.password, 10).then(hash => {
      user1.password = hash;
      user1.name = req.body.name;
           user1.save()
            .then(response => {
                res.status(200).json({
                    message: "success"
                })
            })
  });
}
  else{
    bcrypt.hash(req.body.password, 10).then(hash => {
  User.findOne({ "email": req.body.email },function(err, user) {
    if (err) return done(err);
    if (user) {
       if(!user.isEmailVerified){
          res.status(201).json({
            message: "failure@Activate your account by clicking link in email!"
          })
        }else{
      return res.status(200).json({ error: 'failure@Email is already in use'});
    }}

   // Create a new user
   else { 
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

console.log(date.getTime());
 //1379426880000
 var datetime1 = date.getTime();
    const newUser = new User({ 
        email: req.body.email, 
        password:hash,
        name: req.body.name
    });
   newUser.save().then(result => { 
    const token = signToken(newUser);
    // Respond with signToken 
                         req.userID = result._id;
             return verifyEmail.verifyemail(req,res,next);
                })  
    .catch(err => {
        return  res.status(200).json({
          message :  "failure"
            });
          });
    // Generate the token 
  }
})
  });
}
  })
  },

  signIn: async (req, res, next) => {
    console.log("Nope");
    let fetchedUser;
    console.log(req.body.email);
    User.findOne({ "email": req.body.email })
    .then(user =>{
      if (!user) {
        return res.status(200).json({
          message: "failure@User Not found"
        });
    }
      fetchedUser = user;
      user.save();
       if (!user.isEmailVerified) {
       return res.status(200).json({
          message: "failure@First Activate your Account from your mailbox!"
        });
    }
  return bcrypt.compare(req.body.password,user.password);
}).then(result =>{
  if(!result){
    return res.status(200).json({
          message: "failure@password do not match"
        });
  }

 // var refreshTokens = {} 
   const token = JWT.sign(
        { id: fetchedUser._id,name:fetchedUser.name,email:fetchedUser.email,profilePic:fetchedUser.profilePic},
        JWT_SECRET,
        { expiresIn: "31536000h" }
      );
   console.log("Bhai"+token);
   //  req.session.user = fetchedUser;
   // var refreshToken = randtoken.uid(256);
   //  refreshTokens[refreshToken] = fetchedUser.name;
   //    console.log(req.user);
   //  res.json({token:  token, refreshToken: refreshToken}) 
  // console.log(req.session.user);
   res.status(200).json({
       message:"success",userId:token,level:fetchedUser.level
      });
    })
    .catch(err => {
      console.log(err);
      return res.status(200).json({
        message: "failure@Invalid authentication credentials!"
      });
    });
},

  verify: async( req, res, next) => {
    console.log("Amanji"+req.params.id1);
      Vemail.find({"userID": req.params.id1}, (err, result) =>{
        console.log(result);
      if(result.length == 0){
         res.status(201).json({
        message: "Email already Verified"
      });
      }
      else{
      User.updateOne({_id: req.params.id1},{"isEmailVerified": true}).then(result =>{console.log(result)});
        Vemail.deleteOne({"userID": req.params.id1}).catch(error => {
          console.log(error);
        })
        res.render('../views/suc.ejs');
      // res.status(201).json({
      //   message: "Email Verified"
      // });
 }
    // else{
    //   res.status(500).json({
    //     message: "Invalid User Credentials!"
    //   })
    // }
  })   
 },
 profile: async(req,res,next) =>{
  // if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.headers.authorization.split(" ")[1]);
  User.findById(tok.id).then(user => {
    if (user) {
      const details = {
        name: user.name,
        batch: user.badges,
        profilePic: user.profilePic,
        coverPic:user.coverPic,
        reputation:user.reputation
      }
      res.status(200).json(details);
    } else {
      res.status(404).json({ message: "failure@User not found!" });
    }
  })
  .catch(error => {
    res.status(500).json({
      message: "failure@Fetching User failed!"
    });
  });
 },
 updateProfile: async(req,res,next) =>{
  // if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.headers.authorization.split(" ")[1]);
  User.updateOne({'_id':tok.id},{'branch':req.body.branch,'year':req.body.year,'gender':req.body.gender,'hostel':req.body.hostel,'phone':req.body.phone,'dob':req.body.dob,'name':req.body.name})
  .then(result =>{
    console.log(result);
     if (result.n > 0) {
      res.status(200).json({ message: "success" });
      }else {
        res.status(200).json({ message: "failure@err in Updating" });
      }
    })
    .catch(error => {
      res.status(500).json({
        message: "failure@User not found"
      });
    });
  },
  getProfilePic : async(req,res,next) =>{
  var tok = decode(req.headers.authorization.split(" ")[1]);
  console.log(tok);
  User.findOne({'_id':tok.id}).then(user =>{
        res.status(200).json(user.profilePic);
  });
  },
   getCoverPic : async(req,res,next) =>{
  //   if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
  var tok = decode(req.headers.authorization.split(" ")[1]);
   console.log(tok);
  User.findOne({'_id':tok.id}).then(user =>{
        res.status(200).json({path:user.coverPic});
  });
},
  getpicnameemail: async(req,res,next) =>{
  //   if(!req.session.user){
  //   return res.status(200).send("failure@Not Authorized");
  // }
    console.log("Aman"+req.headers.authorization.split(" ")[1]);
  var tok = decode(req.headers.authorization.split(" ")[1]);
   console.log(tok);
  User.findOne({'email':tok.email}).then(user =>{
   var userInfo = {name:user.name,
                   email:user.email,
                  profilePic:user.profilePic};
        res.status(200).json(userInfo);
  });

  // generateToken: async(req,res,next)=>{
  //   var userId = req.body.id
  // var refreshToken = req.body.refreshToken
  // if( refreshTokens[refreshToken] == userId) {
  //   var token = JWT.sign(userId,  JWT_SECRET, { expiresIn: 300 })
  //   res.status(200).json({token: token});
  // }
  // else {
  //   res.send(200)
  // }
  // }
},
    fcmToken : async(req,res,next) =>{
  var tok = decode(req.headers.authorization.split(" ")[1]);
  User.findOne({'_id':tok.id}).then(user =>{
   if(req.body.fcmToken!=null) {
    console.log(req.body.fcmToken);
    user.fcmToken = req.body.fcmToken;}
    user.save().then(result =>{
      if(result){res.status(200).json({message:"success"});}
      else{res.status(200).json({message:"failure"});}
    })
    });
 }
}
