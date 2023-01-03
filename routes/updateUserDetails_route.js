var details = require("../models/details_model");
var express = require("express");
var router = express.Router();

router.post("/", function (req, res, next) {
  details.updateuserDetails(req.body, function (err, rows) {
    if (err) {
      res.json(err);
    } else {
      res.json(rows);
    }
  });
});
module.exports = router;
