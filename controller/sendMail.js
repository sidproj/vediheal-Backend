const nodemailer = require("nodemailer");

module.exports.sendMail = async (receiver,subject,html)=>{
    try{
        //sending mail
        console.log("hello");
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
              user: process.env.OUTLOOK_ID,
              pass: process.env.OUTLOOK_APP_PASSWORD,
            },
        });
        const mailOptions = {
            from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
            to: receiver, // list of receivers
            subject: subject,
            html:html,
        };

        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            // user.password = await Instructor.hashPassword(pass);
            // await user.save();
            // res.send({status:"Success",message:info.response});
        });
        //end of sending mail
    }
    catch(error){
        console.log(err);
        // res.send({status:"Error",error:err.message});
    }       
}