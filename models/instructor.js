const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

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
    instructorReikis:{
        type:[{
          type:mongoose.SchemaTypes.ObjectId,
          ref:"reiki",
        }],
    },
    description:{
      type:String,
      default:"Hello. I'am an Instructor at vediheal."
    },
    is_deleted: {
      type: Boolean,
      default: false,
    },
  });

// static method to login user
instructorSchema.statics.login = async (email, password) => {
  const instructor = await Instructor.findOne({ email });
  if (instructor) {
    const passwordMatched = await bcrypt.compare(password, instructor.password);
    if (passwordMatched) {
      return instructor;
    }
    throw Error("Incorrect Password");
  }
  throw Error("This email address does not exist");
};

instructorSchema.statics.hashPassword = async (password) => {
  if (password != undefined) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }
};

const Instructor = mongoose.model('instructor',instructorSchema);
module.exports = Instructor;