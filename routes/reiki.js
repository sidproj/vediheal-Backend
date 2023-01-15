const express = require('express');
const router = express.Router();
const reikiController = require("../controller/reiki");
/* GET home page. */
router.get('/', reikiController.get_all_reikies);

module.exports = router;