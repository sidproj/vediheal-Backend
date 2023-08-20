const Coupon = require("../models/coupon");

//for mailing apis;
const nodemailer = require("nodemailer");

module.exports.check_coupon = async (req,res)=>{
    try{
        console.log("here");
        console.log(req.body);
        const coupons = await Coupon.find({code:req.body.code,is_deleted:false});
        console.log(coupons);
        if(coupons.length==0 || coupons == undefined){
            res.send({status:false,message:"Not available"});
            console.log(0);
        }
        else{
            if(coupons[0].min_amt <= req.body.minAmount){
                res.send({status:true,message:"coupon found",coupon:coupons[0]});
            }else{
                res.send({status:false,message:"Not available"});
            }
        }
    }catch(error){
        res.send({status:false,message:"Not available"});
    }
}

module.exports.contact_us_mail = async (req,res)=>{
    try{
        console.log(req.body);
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
            to: "vediheal@outlook.com", // list of receivers
            subject: "New Contact Us Submition",
            html:`<html>
            <h1>Contact Us</h1>
            <p><b>Name</b> : ${req.body.name}</p>
            <p><b>Email</b> : ${req.body.email}</p>
            <p><b>Phone</b> : ${req.body.phone}</p>
            <p><b>Message</b> : ${req.body.message}</p>

            <p>Regard<br/>
            Vediheal</p>
            </html>`,
        };

        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            console.log(info);
            res.send({status:true,message:"Thank you! We will get back to you."});
        });

    }catch(error){
        res.send({status:false,message:"Not available"});
    }
}