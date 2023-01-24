const mongoose = require("mongoose");
const { isEmail, isStrongPassword } = require("validator");
const bcrypt = require("bcrypt");

const userSchema = new mongoose.Schema({
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
    is_deleted: {
      type: Boolean,
      default: false,
    },
    is_admin:{
      type:Boolean,
      default:false,
    }
  });

  
// static method to login instructor
userSchema.statics.login = async (email, password) => {
    const user = await User.findOne({ email });
    if (user) {
      if(user.is_deleted) throw Error("This user is blocked");
      const passwordMatched = await bcrypt.compare(password, user.password);
      if (passwordMatched) {
        return user;
      }
      throw Error("Incorrect Password");
    }
    throw Error("This email address does not exist");
};

userSchema.statics.login_admin = async (email, password) => {
  const user = await User.findOne({ email });
  if (user) {
    if(user.is_deleted) return false;
    const passwordMatched = await bcrypt.compare(password, user.password);
    if (passwordMatched) {
      return user;
    }
    return false;
  }
  return false;
};

userSchema.statics.hashPassword = async (password) => {
  if (password != undefined) {
    const salt = await bcrypt.genSalt();
    password = await bcrypt.hash(password, salt);
    return password;
  }
};  
  
const User = mongoose.model("user", userSchema);

module.exports = User;