const Reiki = require("../models/reiki");
const Instructor = require("../models/instructor");
const Benifit = require("../models/benifits");

module.exports.get_all_reikies = async (req,res)=>{
    try{
        const reikies = await Reiki.find({is_deleted:false});
        for(let i=0;i<reikies.length;i++){
            await reikies[i].populate({
                path:"benifits",
                model:Benifit
            });
        }
        res.send(reikies);
    }catch(error){
        res.send({error:"Error while getting instructor"});
    }
}

module.exports.get_one_reikies = async (req,res)=>{
    try{
        const reiki = await Reiki.findById(req.params.id);
        await reiki.populate({
            path:"benifits",
            model:Benifit
        });
        console.log(reiki);
        res.send(reiki);
    }catch(error){
        res.send({error:"Error while getting instructor"});
    }
}

module.exports.get_one_instructor = async (req,res)=>{
    try{
        const instructor = await Instructor.findById(req.params.id);
        
        await instructor.populate({
            path:"instructorReikis",
            model:Reiki
        });

        res.send(instructor);
    }catch(error){
        res.send({error:"Error while getting instructor"});
    }
}