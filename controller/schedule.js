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
    const schedule = await Schedule.findById(req.body.id);
    await schedule.remove();
    res.send({status:true,message:"Schedule removed successfuly"});
}

module.exports.get_instructor_schedules = async (req,res)=>{
    const schedules = await Schedule.find({instructor_id:req.body.instructor_id,is_booked:false});
    res.send(schedules);
}