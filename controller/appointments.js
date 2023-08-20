const User = require("../models/user");
const Instructor = require("../models/instructor");
const Reiki = require("../models/reiki");
const Appointment = require("../models/appointments");
const Schedule = require("../models/schedule");
const nodemailer = require("nodemailer");

module.exports.user_upcoming_appointments_get = async (req,res)=>{
    try{
        const appointments = await Appointment.find({ 
            user_id:res.user.id,
            is_deleted:false,
            is_completed:false,
        });
        for(let i=0;i<appointments.length;i++){
            await appointments[i].populate({
                path: "instructor_id",
                model: Instructor,
            });
            await appointments[i].populate({
                path:"reiki_id",
                model: Reiki, 
            });
            await appointments[i].populate({
                path:"time_slot",
                model: Schedule,
            })
        }
        res.send(appointments);
    }catch(err){
        res.send({error:"Error. Please try again later!"});
    }
}

module.exports.user_previous_appointments_get = async (req,res)=>{
    try{
        const appointments = await Appointment.find({ 
            user_id:res.user.id,
            is_deleted:false,
            is_completed:true,
        });
        for(let i=0;i<appointments.length;i++){
            await appointments[i].populate({
                path: "instructor_id",
                model: Instructor,
            });
            await appointments[i].populate({
                path:"reiki_id",
                model: Reiki, 
            });
            await appointments[i].populate({
                path:"time_slot",
                model: Schedule,
            })
        }
        res.send(appointments);
    }catch(err){
        res.send({error:"Error. Please try again later!"});
    }
}


module.exports.instructor_appointments_get = async (req,res)=>{
    try{
        const instructor = await  Instructor.findById(res.user.id);
        const appointments = await Appointment.find({ 
            instructor_id:res.user.id,
            is_completed:req.body.is_completed
        });

        for(let i=0;i<appointments.length;i++){
            await appointments[i].populate({
                path: "user_id",
                model: User,
            });
            await appointments[i].populate({
                path:"reiki_id",
                model: Reiki, 
            });
        }

        res.send(appointments);
    }catch(err){
        res.send({error:"Error. Please try again later!"});
    }
}

module.exports.instructor_appointments_complete = async (req,res)=>{
    try{
        const instructor = await  Instructor.findById(res.user.id);

        const appointment = await Appointment.findById(req.body.appointment_id);
        appointment.is_completed = true;
        await appointment.save();

        console.log(appointment);

        const appointments = await Appointment.find({ 
            instructor_id:res.user.id,
            is_completed:false,
        });

        for(let i=0;i<appointments.length;i++){
            await appointments[i].populate({
                path: "user_id",
                model: User,
            });
            await appointments[i].populate({
                path:"reiki_id",
                model: Reiki, 
            });
        }

        res.send(appointments);
    }catch(err){
        res.send({error:"Error. Please try again later!"});
    }
}


module.exports.set_appointments_post = async(req,res)=>{
    try{
        const user = await User.findById(res.user.id);
        const schedule = await Schedule.findById(req.body.schedule_id);
        // const instructor = await Instructor.findById(schedule.instructor_id);

        const reiki = await Reiki.findById(req.body.reiki);

        // if(!user || !reiki) throw Error("Error while setting appointments!");
        console.log(req.body);

        for(let key in req.body.dateTime){
            const appointment = Appointment({
                user_id:res.user.id,
                reiki_id:req.body.reiki,
                price:req.body.price,
                // time_slot:req.body.schedule_id,
                // instructor_id:schedule.instructor_id,
                start_time:req.body.dateTime[key],
                stripe_payment_id:req.body.stripe_payment_id,
            });
            
            // schedule.is_booked=true;
            await appointment.save();

            // send mail to client
            const receiverClient = user.email;
            const subjectClient = "Appointment booked successfully.";
            // const htmlClient = `<p>Your appointment is booked with instructor: 
            //     <b> ${instructor.first_name} ${instructor.last_name}</b><br>
            //     email: <b>${instructor.email}</b><br>
            //     for reikie: <b>${reiki.name}</b><br>
            //     on: <b> ${schedule.start_time}</b>
            // </p>`;
            
            const htmlClient = `<p>Your appointment is booked 
                for reiki: <b>${reiki.name}</b><br>
                Your instructor will be alloted soon.
            </p>`;
            // await sendMail.sendMail(receiverClient,subjectClient,htmlClient);
            const transporter = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                user: process.env.OUTLOOK_ID,
                pass: process.env.OUTLOOK_APP_PASSWORD,
                },
            });
            const mailOptions = {
                from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
                to: receiverClient, // list of receivers
                subject: subjectClient,
                html:htmlClient,
            };

            await transporter.sendMail(mailOptions);
        }
        res.send({status:"success"});
    }catch(err){
        console.log(err);
        res.send({error:err.message});
    }
}

module.exports.set_meeting_link = async (req,res)=>{
    try{
        const appointment = await Appointment.findById(req.body.appointment_id);
        console.log(appointment);
        const user = await User.findById(appointment.user_id);
        const instructor = await Instructor.findById(appointment.instructor_id);
        const reiki = await Reiki.findById(appointment.reiki_id);
        appointment.meeting_link = req.body.meeting_link;
        await appointment.save();
        
        // send mail to client
        const receiverClient = user.email;
        const subjectClient = "Meeting link changed.";
        const htmlClient = `<p>Your appointment is booked with instructor: 
            <b> ${instructor.first_name} ${instructor.last_name}</b><br>
            email: <b>${instructor.email}</b><br>
            for reiki: <b>${reiki.name}</b><br>
            New meeting link: <b> ${appointment.meeting_link}</b>
        </p>`;
        // await sendMail.sendMail(receiverClient,subjectClient,htmlClient);
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
            user: process.env.OUTLOOK_ID,
            pass: process.env.OUTLOOK_APP_PASSWORD,
            },
        });
        const mailOptions = {
            from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
            to: receiverClient, // list of receivers
            subject: subjectClient,
            html:htmlClient,
        };

        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            //send mail to instructor
            console.log(info);
            const receiverInstructor = instructor.email;
            const subjectInstructor = "Meeting link changed.";
            const htmlInstructor = `<p>Your appointment is booked with Client: 
                <b> ${user.first_name} ${user.last_name}</b><br>
                email: <b>${user.email}</b><br>
                for reiki: <b>${reiki.name}</b><br>
                New meeting link: <b> ${appointment.meeting_link}</b>
            </p>`;
            // await sendMail.sendMail(receiverInstructor,subjectInstructor,htmlInstructor);
            console.log("hello");
            const transporter1 = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                user: process.env.OUTLOOK_ID,
                pass: process.env.OUTLOOK_APP_PASSWORD,
                },
            });
            const mailOptions1 = {
                from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
                to: receiverInstructor, // list of receivers
                subject: subjectInstructor,
                html:htmlInstructor,
            };

            transporter1.sendMail(mailOptions1,async (err,info)=>{
                if(err) throw Error(err);
                console.log(info);
                res.send({status:"success",appointment});
            });
            //
        });
        //
    }catch(err){
        console.log(err);
        res.send({status:"Error",error:err.message});
    }
}

module.exports.cancel_meeting = async (req,res)=>{
    try{
        const appointment = await Appointment.findById(req.body.appointment_id);
        console.log(appointment);
        
        const user = await User.findById(appointment.user_id);
        const instructor = await Instructor.findById(appointment.instructor_id);
        const reiki = await Reiki.findById(appointment.reiki_id);
        appointment.status = 'CANCELED';
        await appointment.save();
        
        // send mail to client
        const receiverClient = user.email;
        const subjectClient = "Meeting canceled successfully.";
        const htmlClient = `<p>Your appointment is canceled<br/>
            for reiki: <b>${reiki.name}</b><br>
            scheduled on <b>${appointment.start_time.toISOString().slice(0, 10)} ${appointment.start_time.getHours()}:${appointment.start_time.getMinutes()}</b><br/>
            appointment ID: <b>${appointment.id}</b>.<br/>
            You will recieve call and or email from VediHeal representative regarding cancellation. 
        </p>`;
        // await sendMail.sendMail(receiverClient,subjectClient,htmlClient);
        const transporter = nodemailer.createTransport({
            service: "hotmail",
            auth: {
            user: process.env.OUTLOOK_ID,
            pass: process.env.OUTLOOK_APP_PASSWORD,
            },
        });
        const mailOptions = {
            from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
            to: receiverClient, // list of receivers
            subject: subjectClient,
            html:htmlClient,
        };

        transporter.sendMail(mailOptions,async (err,info)=>{
            if(err) throw Error(err);
            console.log(info);
            //send mail to instructor if instructor is assigned
            if(!instructor){
                res.send({status:"success",appointment});
                return;
            }
            const receiverInstructor = instructor.email;
            const subjectInstructor = "Meeting is canceled by the Client.";
            const htmlInstructor = `<p>Your appointment is CANCELED with Client:
                <b> ${user.first_name} ${user.last_name}</b><br>
                email: <b>${user.email}</b><br/>
                for reiki: <b>${reiki.name}</b><br/>
                scheduled on <b>${appointment.start_time.toISOString().slice(0, 10)} ${appointment.start_time.getHours()}:${appointment.start_time.getMinutes()}</b><br/>
                appointment ID: <b>${appointment.id}</b>
            </p>`;
            // await sendMail.sendMail(receiverInstructor,subjectInstructor,htmlInstructor);
            console.log("hello");
            const transporter1 = nodemailer.createTransport({
                service: "hotmail",
                auth: {
                user: process.env.OUTLOOK_ID,
                pass: process.env.OUTLOOK_APP_PASSWORD,
                },
            });
            const mailOptions1 = {
                from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
                to: receiverInstructor, // list of receivers
                subject: subjectInstructor,
                html:htmlInstructor,
            };

            transporter1.sendMail(mailOptions1,async (err,info)=>{
                if(err) throw Error(err);
                const transporter2 = nodemailer.createTransport({
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
                const mailOptions2 = {
                    from: `Vediheal ${process.env.OUTLOOK_ID}`, // sender address
                    to: "vediheal@outlook.com", // list of receivers
                    subject: "Appointment Cancellation",
                    html:`<html>
                        <p>
                            Appointment is canceled for user ${user.first_name} ${user.last_name}<br/>
                            email: ${user.email}
                            phone: ${user.phone_no}
                            for reiki: <b>${reiki.name}</b><br>
                            scheduled on <b>${appointment.start_time.toISOString().slice(0, 10)} ${appointment.start_time.getHours()}:${appointment.start_time.getMinutes()}</b><br/>
                            appointment ID: <b>${appointment.id}</b>.<br/>
                        </p>
                    <p>Regard<br/>
                    Vediheal</p>
                    </html>`,
                };
        
                transporter2.sendMail(mailOptions2,async (err,info)=>{
                    if(err) throw Error(err);
                    console.log(info);
                    res.send({status:"success",appointment});
                });
            });
            //
        });
        //
    }catch(err){
        console.log(err);
        res.send({status:"Error",error:err.message});
    }
}