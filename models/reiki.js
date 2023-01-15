const mongoose = require("mongoose");

const reikiSchema = new mongoose.Schema({
    name:{
        type:String,
        require:[true,"Please enter reiki name"],
    },
    description:{
        type:String,
        require:[true,"Please enter reiki description"],
    },
    image:{
        type:String,
    },
    benifits:{
        type: [mongoose.SchemaTypes.ObjectId],
        ref: "Benifit",
    },
    is_deleted: {
      type: Boolean,
      default: false,
    }
  });

const Reiki = new mongoose.model('reiki',reikiSchema);

module.exports = Reiki;