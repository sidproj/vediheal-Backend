const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
    code:{
        type:String,
        require:[true,"Please enter coupon code"]
    },
    discount_amt:{
        type:Number,
        require:[true,"Please enter discount amount"]
    },
    is_deleted:{
        type:Boolean,
        default:false
    }
});

const Coupon = mongoose.model('coupon',couponSchema);

module.exports = Coupon;