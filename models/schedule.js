const mongoose = require("mongoose");

const scheduleSchema = new mongoose.Schema({
    instructor_id:{
        type:mongoose.SchemaTypes.ObjectId,
        ref:"instructor",
        require:[true,"Please enter instructor id"]
    },
    start_time:{
        type:Date,
        require:[true,"Please enter start time"]
    },
    end_time:{
        type:Date,
        require:[true,"Please enter end time"]
    },
    is_booked:{
        type:Boolean,
        default:false,
    }
});

const Schedule = mongoose.model('schedule',scheduleSchema);
module.exports = Schedule;