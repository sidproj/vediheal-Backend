const User = require("../models/user");
const Instructor = require("../models/instructor");
const Reiki = require("../models/reiki");
const Appointment = require("../models/appointments");

module.exports.user_appointments_get = async (req,res)=>{
    try{
        const appointments = await Appointment.find({ user_id:res.user.id,is_deleted:false});
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
    // try{
        const appointments = await Appointment.find({ instructor_id:res.user.id,is_deleted:false});
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
    // }catch(err){
    //     res.send({error:"Error. Please try again later!"});
    // }
}

module.exports.set_appointments_post = async(req,res)=>{
    try{
        const user = await User.findById(res.user.id);
        const instructor = await Instructor.findById(req.body.instructor);
        const reiki = await Reiki.findById(req.body.reiki);
        const slots = req.body.slots;

        console.log(user);
        console.log(instructor);
        console.log(reiki);

        if(!user || !instructor || !reiki) throw new Error("Error while setting appointments!");

        const appointment = Appointment({
            user_id:res.user.id,
            instructor_id:req.body.instructor,
            reiki_id:req.body.reiki,
        });
        const appSlots = [];
        let price = req.body.price / slots ;

        for(let i=0;i<slots;i++){
            appSlots.push({
                price:price
            });
        }
        appointment.slots = appSlots;
        await appointment.save();
        
        res.send({status:"success",appointment});
    }catch(err){
        res.send({status:"Error",error:"Error while setting appointments!"})
    }
}