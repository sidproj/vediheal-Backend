const Razorpay = require("razorpay");
const Appointment = require("../models/appointments");

module.exports.get_razorpay_key = async (req,res)=>{
    res.send({key:process.env.RAZORPAY_KEY_ID});
}

module.exports.create_order = async (req,res)=>{
    try{
        const instance = new Razorpay({
            key_id:process.env.RAZORPAY_KEY_ID,
            key_secret:process.env.RAZORPAY_SECRET
        });
        const options = {
            amount:req.body.amount,
            currency:"INR"
        };
        const order = await instance.orders.create(options);

        if(!order) return res.status(500).send("Error occured!");
        res.send(order);

    }catch(error){
        res.status(500).send(error);
    }
}

module.exports.pay_order = async (req,res)=>{
    try{
        const {amount,razorpayPaymentId,razorpayOrderId, razorpaySignature,appointmentId} = req.body;
        const appointment = await Appointment.findById(appointmentId);
        appointment.razorpay.paymentId = razorpayPaymentId;
        appointment.razorpay.orderId = razorpayOrderId;
        appointment.razorpay.signature = razorpaySignature;
        await appointment.save();
        res.send({
            msg:"Payment successfull",
            appointment:appointment
        });
    }catch(error){
        console.log(error);
        res.status(500).send(error);
    }
}
