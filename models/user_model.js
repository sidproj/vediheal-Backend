var db = require("../dbconnect");
var Product = {
  getUserDetails: function (user, callback) {
    return db.query("select * from user_details ", [user.id], callback);
  },
};
module.exports = Product;
