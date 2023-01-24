const User = require("../models/user");
const Instructor = require("../models/instructor");


//for mailing apis;
const hbs = require("nodemailer-express-handlebars");
const nodemailer = require("nodemailer");

module.exports.user_forgot_password_post = async (req,res)=>{
    try{
        
        const user = await User.findOne({ email: req.body.email });

        if(!user) throw Error("No user for the email was found!");

        const pass = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);

        const transporter = nodemailer.createTransport({
            service:"Outlook365",
            host: "smtp-mail.outlook.com",
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
              user: process.env.OUTLOOK_ID,
              pass: process.env.OUTLOOK_APP_PASSWORD,
            },
        });

        const mailOptions = {
            from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
            to: user.email, // list of receivers
            subject: "New Password",
            html:`<html>
            <p>Hello ${user.first_name} ${user.last_name} your
            <b> New Password </b> is ${pass} </p>

            Yours faithfully,
            Vediheal.
            </html>`,
        };

        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            user.password = await User.hashPassword(pass);
            await user.save();
            res.send({status:"Success",message:info.response});
        });

    }catch(error){
        res.send({status:"Error","message":"Error while sending new password to user's email!"});
    }
}


module.exports.instructor_forgot_password_post = async (req,res)=>{
    try{
        
        const user = await Instructor.findOne({ email: req.body.email });

        if(!user) throw Error("No instructor for the email was found!");

        const pass = Math.random().toString(36).slice(2) + Math.random().toString(36).toUpperCase().slice(2);

        const transporter = nodemailer.createTransport({
            service:"Outlook365",
            host: "smtp-mail.outlook.com",
            tls: {
                ciphers: "SSLv3",
                rejectUnauthorized: false,
            },
            auth: {
              user: process.env.OUTLOOK_ID,
              pass: process.env.OUTLOOK_APP_PASSWORD,
            },
        });
        const mailOptions = {
            from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
            to: user.email, // list of receivers
            subject: "New Password",
            html:`<html>
            <p>Hello ${user.first_name} ${user.last_name} your
            <b> New Password </b> is ${pass} </p>

            Yours faithfully,
            Vediheal.
            </html>`,
        };

        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            user.password = await Instructor.hashPassword(pass);
            await user.save();
            res.send({status:"Success",message:info.response});
        });

    }catch(error){
        res.send({status:"Error","message":"Error while sending new password to user's email!"});
    }
}