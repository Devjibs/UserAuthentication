//adding the necessary dependencies for nodejs app to work for server and database
require('dotenv').config();
const express = require("express");
const bodyParser = require("body-parser");
const ejs = require('ejs');
const mongoose = require("mongoose");
var nodemailer = require('nodemailer');


//LgqCW1X6Snhm7ygx   GoMarktDB-Admin

const app = express();
const PORT = process.env.PORT;

//rendering app to use express js
app.use(express.static("public"));
app.set('view engine', 'ejs');
app.use(express.json());
app.use(express.static('./public'));
app.use(bodyParser.urlencoded({
    extended: true
}));

//Connecting User to MongoDB Database
const MONGOD_URI = process.env.MARKTDLG

//Connecting to Mongoose database
mongoose.connect(MONGOD_URI || 'mongodb://localhost/marktDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true
});

mongoose.connection.on('connected', () => {
    console.log('Mongoose is connected');
});

//Creating Database
const userSchema = new mongoose.Schema ({
    name: {
        type: String,
        required: true
      },
    emails: {
        type: String,
        required: "Email can't be empty.",
        unique: true,
        },
    business: {
        type: String,
        required: "Business Name can't be empty."
        },
    phone: {
        type: String,
        required: "Reqired for further contact. Can't be empty."
        },
    storename: {
        type: String,
        required: "Email can't be empty.",
        unique: true
        },
    address: {
        type: String,
        },
});

const User = new mongoose.model('User', userSchema);

//Getting the web pages with the server callback
app.get("/", function(req, res){
    res.render("index");
});

app.get("/signup", function(req, res){
    res.render("signup");
});


//Requesting the SignUp Form data entered by users to post on the database
app.post("/signup", function(req, res){
    const newUser = new User({
        name: req.body.name,
        emails: req.body.emails,
        business: req.body.business,
        phone: req.body.phone,
        storename: req.body.storename,
        address: req.body.address,        
});

    //Saving the user entry on GoMarkt mongodb/database
    newUser.save(function(err){
        if (err) {
            console.log(err);
            res.write("<h1>Incorrect Signup Credentials, Please check your inputs and Try again</h1>");
                res.end()
        } else {
            res.render("welcome");
            //Defining the variables to be used for email message
            var nodemailer = require('nodemailer');

            var email = req.body.emails;
            var name = req.body.name;
            var phone = req.body.phone;
            var storename = req.body.storename;
            var address = req.body.address;
            
            //Getting access to connect to gmail host/sender
            var transporter = nodemailer.createTransport({
                service: 'gmail',
                auth: {
                    user: process.env.EMAIL,
                    pass: process.env.PASSWORD,
                }
            });
            
            //Send Email to user when registration is complete
            var mailOptions = {
                from: 'marktafrica@gmail.com',
                to: `${email}`,
                subject: `Welcome to GoMarkt`,
                html: `Hi ${name}, thank you for choosing GoMarkt. These were your entries... 
                Name: ${name}, 
                Phone Number: ${phone}, 
                Storename: ${storename}, 
                Email: ${email}, 
                Address: ${address} 
                <a href='https://docs.google.com/forms/d/e/1FAIpQLScLA_EenmV3JLiRr_mEwlscGC3EKbCLxXUm4sFr-1OiS9CuTw/viewform' target='_blank'>
                <input type='button' style='padding-left:25px;padding-top:11px;padding-right:26px;padding-bottom:13px;margin-left:11px;margin-top:10px;margin-right:10px;margin-bottom:10px;background-color:#ad0000;color:#FFFFFF;border-left-width:1px;border-top-width:1px;border-right-width:1px;border-bottom-width:1px;border-color:#d5d5d5;border-radius:5px;cursor:pointer' value='SET UP STORE' onMouseOver=this.style.backgroundColor='#393737';this.style.color='#ffffff';this.style.borderColor='#d5d5d5' onMouseOut=this.style.backgroundColor='#ad0000';this.style.color='#FFFFFF';this.style.borderColor='#d5d5d5' />
                </a>`,};

            //Send Email to admin when registration is complete    
            var mailOption = {
                from: process.env.EMAIL,
                to: 'ajidejibola@yahoo.com, ayo@wildfire.ng, abel@wildfire.ng',
                subject: `GoMarkt Update`,
                text: `Hi admin, A new user ${name} just registered on GoMarkt.`
            };

            transporter.sendMail(mailOptions, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
            });

            transporter.sendMail(mailOption, function(error, info){
                if (error) {
                    console.log(error);
                } else {
                    console.log('Email sent: ' + info.response);
                }
        });
    }});
});

app.post("/index", function(req, res){
    var storename = req.body.storename;
    // Find only one document matching 
    User.findOne({storename: storename }, function (err, foundUser) { 
        if (err){ 
            console.log(err) 
            alert('error')
        } else {
            if (foundUser) {
                if (foundUser.storename === storename) {
                    res.redirect(`https://${storename}.gomarkt.store/login`);
                } else {
                    res.render('404-store')
                }
            } else {
                res.render('404-store');
                res.end()
            }
        }
    });
    
});

app.listen(PORT);
