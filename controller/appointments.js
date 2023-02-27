const User = require("../models/user");
const Instructor = require("../models/instructor");
const Reiki = require("../models/reiki");
const Appointment = require("../models/appointments");
const Schedule = require("../models/schedule");

module.exports.user_appointments_get = async (req,res)=>{
    try{
        console.log(res.user);
        console.log(req.body);
        const appointments = await Appointment.find({ 
            user_id:res.user.id,
            is_deleted:false,
            is_appointed:req.body.is_appointed
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
        }
        res.send(appointments);
    }catch(err){
        res.send({error:"Error. Please try again later!"});
    }
}

module.exports.instructor_appointments_get = async (req,res)=>{
    try{
        const instructor = await  Instructor.findById(res.user.id);
        console.log(instructor);
        console.log(req.body);
        const appointments = await Appointment.find({ 
            instructor_id:res.user.id,
            is_completed:req.body.is_completed
        });
        console.log(appointments);

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
        let prefered_instructor;
        if(req.body.prefered_instructor){
            prefered_instructor = await Instructor.findById(req.body.prefered_instructor);
        }

        const reiki = await Reiki.findById(req.body.reiki);

        console.log(user,reiki);

        if(!user || !reiki) throw Error("Error while setting appointments!");

        const appointment = Appointment({
            user_id:res.user.id,
            prefered_instructor:req.body.prefered_instructor,
            reiki_id:req.body.reiki,
            price:req.body.price,
            time_slot:req.body.schedule_id
        });

        schedule.is_booked=true;
        await schedule.save();

        if(req.body.instructor_id) appointment.instructor_id = req.body.instructor_id;

        await appointment.save();
        
        res.send({status:"success",appointment});
    }catch(err){
        console.log(err);
        res.send({status:"Error",error:err.message});
    }
}