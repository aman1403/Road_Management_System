
var nodemailer = require('nodemailer');
const userCredential = require('../keys');
const Vemail = require('../models/verifyemail');
const User = require('../models/user');
var smtpTransport = nodemailer.createTransport('smtps://' + userCredential.user  + ':' +userCredential.pass +'@smtp.gmail.com');
var rand,mailOptions,host,link,userId;
var fs = require('fs');
var handlebars = require('handlebars');
var readHTMLFile = function(path, callback) {
    fs.readFile(path, {encoding: 'utf-8'}, function (err, html) {
        if (err) {
            throw err;
            callback(err);
        }
        else {
            callback(null, html);
        }
    });
};

exports.verifyemail = (req,res,next) => {
    rand = Math.floor((Math.random() * 1000000) + 54 );
    host = req.get('host');
    link = "https://instigo-project.appspot.com" + "/users/verify/"+rand+'/'+ req.userID;
    readHTMLFile(__dirname + '/verify.html', function(err, html) {
        // if (err)throw (err) ;
    var template = handlebars.compile(html);
    var replacements = {
         rand: rand,
         userId:req.userID
    };
    var htmlToSend = template(replacements);
    mailOptions = {
        from: '"InstiGO" <instigo.iitdh@gmail.com>',
        to: req.body.email,
        subject: "Verify your email for Government App",
        html: htmlToSend
    }
    // mailOptions = {
    //     from: '"InstiGO" <instigo.iitdh@gmail.com>',
    //     to: req.body.email,
    //     subject: "Verify your email for InstiGO",
    //     html:"Hello,<br> Follow the link to verify your email address.<br><a href=" + link + ">Clink here to verify</a><br>If you didn’t ask to verify this address, you can ignore this email.<br><br>Thanks,<br>Your InstiGO team"+"</body>"
    // }
    smtpTransport.sendMail(mailOptions, (error, info) => {
        if(error) {
            console.log(error);
            User.deleteOne({"email": req.body.email}).then(response => {
                console.log("User deleted as email not sent!");
            }).catch(erorr => {
                console.log("Error while Deleting!");
            })
            return res.status(500).json({
                message: "failure_Check Email and password of sender!"
              });
        }
        const vemail = new Vemail({
            userID: req.userID,
            rand : rand
        });
        console.log("reached");
        vemail
            .save()
            .then(response => {
                res.status(200).json({
                    message: "success"
                })
            })
            .catch(error => {
                res.status(500).json({
                    message: "failure@Error occured while saving data!"
                  });
            })
        console.log(info.response);
    })

})
 }   
