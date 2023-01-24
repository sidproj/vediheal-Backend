const Instructor = require("../models/instructor");
const User = require("../models/user");
const Reiki = require("../models/reiki");
const Appointment = require("../models/appointments");
const Benifit = require("../models/benifits");

module.exports.add_instructor_reiki = async (req,res)=>{
    try{
        const instructor = await Instructor.findOne();
        const reiki = await Reiki.findOne();
        instructor.instructorReikis = {reiki:reiki.id};
        await instructor.save();
        res.send(instructor);
    }catch(error){
        res.send(error);
    }
}

//current----------------
module.exports.get_appointment_details = async(req,res)=>{
    // try{
        
        // const user = await User.findOne();
        // const instructor  = await Instructor.findOne();
        // const reiki=await Reiki.findOne();

        // const appointment = Appointment({
        //     start_time: new Date(),
        //     end_time: new Date(),
        //     user_id:user.id,
        //     instructor_id:instructor.id,
        //     reiki_id:reiki.id,
        // });
        // await appointment.save();
        const appointment = await Appointment.findOne();

        await appointment.populate({
            path:'user_id',
            ref:User,
        });

        await appointment.populate({
            path:'instructor_id',
            ref:Instructor,
        });

        await appointment.populate({
            path:'reiki_id',
            ref:Reiki,
        });
        
        console.log(appointment);

        res.send("appointment");
    // }catch(error){
    //     res.send(error);
    // }
}

module.exports.add_benifits_to_reiki = async (req,res)=>{
    try{
        const reiki = await Reiki.findOne({name:"Anti-Depression Reiki"});
        console.log(reiki);
        const benifits=[];
        const names =[ 
            "Science Proven",
            "Cost Effective",
            "Boosts Mood",
            "Relieves Anxiety",
            "Heals Depression"];
        
        for(let i=0;i<names.length;i++){
            const r = await Benifit.findOne({name:names[i]});
            benifits.push(r.id);
        }
        reiki.benifits = [];
        reiki.benifits = benifits;
        await reiki.save();
        res.send("Done");
    }catch(err){
        console.log(err);
        res.send(err);
    }
}

module.exports.add_user = async (req,res)=>{
    const user = User({
        first_name:"Anurag",
        last_name:"Sharma",
        email:"anuragsharma6269@gmail.com",
        phone_no:9876543210,

    });
    await user.save();
    user.password = await User.hashPassword("1234@abcdA");
    await user.save();
    res.send("Done");
}

module.exports.add_instructor = async (req,res)=>{
    const instructor = Instructor({
        first_name:"Sidhraj",
        last_name:"Mori",
        email:"sdkm7016816547@gmail.com",
        phone_no:9106790978,
    });
    await instructor.save();
    instructor.password = await Instructor.hashPassword("1234@abcdA");
    await instructor.save();
    res.send("Done");
}

module.exports.set_benifits_info = async (req,res)=>{
    const names = ["Science Proven",
    "Cost Effective",
    "Boosts Mood",
    "Relieves Anxiety",
    "Heals Depression",
    "Science Proven",
    "Pain Relief",
    "Emotional Distress",
    "Smooth Detoxification",
    "Proper sleep pattern",
    "Gives Control",
    "Facilitates interpersonal connections",
    "Positivity",
    "Wellness",
    "Relaxation",
    "Peace"]
    for(let i=0;i<names.length;i++){
        const benifit = new Benifit({
            name:names[i],
        })
        await benifit.save();
    }
    res.send("Saved benifits");
}