const User = require("../models/user");
const Appointment = require("../models/appointments");
const Reiki = require("../models/reiki");

const nodemailer = require("nodemailer");
const Instructor = require("../models/instructor");

module.exports.send_review = async (req,res)=>{
    try{
        const user = await User.findById(res.user.id);
        const appointment = await Appointment.findById(req.body.appointment_id);
        console.log(appointment);
        const instructor = await Instructor.findById(appointment.instructor_id);
        const reiki = await Reiki.findById(appointment.reiki_id);

        const rating = req.rating;
        const feedback = req.feedback;

        //setting up transporter for the mail
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
        //setting up mailing options
        const mailOptions = {
            from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
            to: process.env.OUTLOOK_ID, // list of receivers
            subject: "Appointment Review",
            html:
            `<html>
            <body>
                <div>Reiview by: <br>
                    <span> Full name: ${user.first_name} ${user.last_name} </span><br>
                    <span> Email: ${user.email}</span><br>
                    <span> Phone: ${user.phone_no}</span><br>
                </div>
                <div>Instructor details:
                    <span> Full name: ${instructor.first_name} ${instructor.last_name} </span><br>
                    <span> Email: ${instructor.email}</span><br>
                    <span> Phone: ${instructor.phone_no}</span><br>
                </div>
                <div>Reiki: <span> ${reiki.name} </span> </div>
                <div>Start time: <span>${appointment.start_time}</span></div>
                <div>End time: <span>${appointment.end_time}</span></div>
                <div>User's Rating (out of 10) <span>${rating}</span></div>
                <div>User's Feedback <span>${feedback}</span></div>
            </body>
            </html>`,
        };
        //sending mail
        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            res.send({status:"Success",message:info.response});
        });
    }catch(error){
        res.render("error",{error:error.message,instruction:"Try again later."});
    }
}