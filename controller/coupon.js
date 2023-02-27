const Coupon = require("../models/coupon");

module.exports.check_coupon = async (req,res)=>{
    try{
        console.log(req.body);
        const coupons = await Coupon.find({code:req.body.code,is_deleted:false});
        console.log(coupons);
        if(coupons==undefined){
            res.send({status:false,message:"Not available"});
        }
        res.send({status:true,message:"coupon found",coupon:coupons[0]});
    }catch(error){
        res.send({status:false,message:"Not available"});
    }
}