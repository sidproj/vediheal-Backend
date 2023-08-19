const mongoose = require("mongoose");

const feed_back = {
    data:{
        type:String,
        default:null,
    },
    stars:{
        type:Number,
        default:null,
    }
};

const appointmentSchema = new mongoose.Schema({
    start_time:{
        type:Date,
        default:new Date()
    },
    end_time:{
        type:Date,
    },
    time_slot:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"schedule"
    },
    prefered_instructor:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"instructor"
    },
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"user",
    },
    instructor_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"instructor",
        default:null
    },
    reiki_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"reiki"
    },
    price:{
        type:Number,
        default:0
    },
    is_appointed:{
        type:Boolean,
        default:false,
    },
    is_deleted:{
        type:Boolean,
        default:false,
    },
    is_completed:{
        type:Boolean,
        default:false
    },
    meeting_link:{
        type:String,
        default:null
    },
    stripe_payment_id:{
        type:String,
        default:null
    },
    feedback:{
        type:feed_back,
        default:null,
    }
});

const Appointment = new mongoose.model('appointment',appointmentSchema);

module.exports = Appointment;