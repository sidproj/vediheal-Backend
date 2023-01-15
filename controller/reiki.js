const Reiki = require("../models/reiki");

module.exports.get_all_reikies = async (req,res)=>{
    const reikies = await Reiki.find();
    res.send(reikies);
}