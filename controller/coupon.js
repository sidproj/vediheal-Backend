const Coupon = require("../models/coupon");

module.exports.check_coupon = async (req,res)=>{
    try{
        console.log(req.body);
        const coupons = await Coupon.find({code:req.body.code,is_deleted:false});
        console.log(coupons);
        if(coupons.length==0 || coupons == undefined){
            res.send({status:false,message:"Not available"});
            console.log(0);
        }
        else{
            if(coupons[0].min_amt <= req.body.minAmount){
                res.send({status:true,message:"coupon found",coupon:coupons[0]});
            }else{
                res.send({status:false,message:"Not available"});
            }
        }
    }catch(error){
        res.send({status:false,message:"Not available"});
    }
}