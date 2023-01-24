const mongoose = require("mongoose");


const instructorTimeSchema = new mongoose.Schema({
    start_time:{
        type:Date,
        default:null
    },
    end_time:{
        type:Date,
        default:null
    },
    price:{
        type:Number,
    }
});

const appointmentSchema = new mongoose.Schema({
    slots:{
        type:[instructorTimeSchema],
    },
    user_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"user",
    },
    instructor_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"instructor",
    },
    reiki_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"reiki"
    },
    is_deleted:{
        type:Boolean,
        default:false,
    }
});

const Appointment = new mongoose.model('appointment',appointmentSchema);

module.exports = Appointment;