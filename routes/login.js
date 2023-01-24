const express = require('express');
const router = express.Router();
const userController = require("../controller/user");
const instructorController = require("../controller/instructor");

router.post("/user",userController.login_post);

router.post("/instructor",instructorController.login_post);

module.exports = router;