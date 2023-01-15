const mongoose = require("mongoose");

const sessionsSchema = new mongoose.Schema({
    start_time:{
        type:Date,
    },
    end_time:{
        type:Date,
    },
    price:{
        type:Number,
    }
});

const instructorSchema = new mongoose.Schema({
    first_name: {
      type: String,
      required: [true, "Please enter a first name"],
    },
    last_name: {
      type: String,
      required: [true, "Please enter a last name"],
    },
    email: {
      type: String,
      unique: true,
      required: [true, "Please enter an email"],
      validate: [isEmail, "Please provide a valid email address"],
      lowercase: true,
    },
    password: {
      type: String,
      validate: [isStrongPassword, "Please provide a valid password"],
      minlength: 8,
    },
    phone_no: {
      type: String,
      minlength: [10, "Phone number must be 10 digits"],
      maxlength: [10, "Phone number must be 10 digits"],
    },
    reikis:{
        type:[mongoose.SchemaTypes.ObjectId],
        ref:"Reiki",
    },
    session_type:{
        type:[sessionsSchema],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_admin: {
      type: Boolean,
      default: false,
    },
  });

const Instructor = mongoose.model('instructor',instructorSchema);
module.exports = Instructor;