const Schedule = require("../models/schedule");
const Instructor = require("../models/instructor");

module.exports.create_schedule = async (req,res)=>{
    const schedule = new Schedule({
        instructor_id:req.body.instructor_id,
        start_time:req.body.start_time,
        end_time:req.body.end_time
    });

    await schedule.save();
    res.send({status:true,message:"Schedule created successfuly"});
}

module.exports.delete_schedule = async (req,res)=>{
    try{
        const schedule = await Schedule.findById(req.body.id);
        await schedule.remove();
        res.send({status:true,message:"Schedule removed successfuly"});
    }catch(err){
        console.log(err);
        res.send({status:"Error",error:"Error while deleting schedule"});
    }
}

module.exports.get_instructor_schedules = async (req,res)=>{

    const schedules = await Schedule.find({instructor_id:req.body.instructor_id,is_booked:false});
    res.send(schedules);
}

module.exports.get_reiki_schedules = async (req,res)=>{
    try{
        const instructors = await Instructor.find({"instructorReikis":req.body.reiki});
        const instructor_ids=[];
        instructors.map(inst =>{
            instructor_ids.push(inst.id);
        });
        const schedule = await Schedule.find({instructor_id: {$in:instructor_ids}});
        res.send(schedule);
    }catch(err){
        console.log(err);
        res.send({status:"Error",error:err.message});
    }
}