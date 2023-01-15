const mongoose = require("mongoose");


const benifitSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please enter reiki name"],
    },
    is_deleted: {
      type: Boolean,
      default: false,
    }
  });

const Benifit = mongoose.model('Benifit',benifitSchema);

module.exports = Benifit;