const express = require('express');
const router = express.Router();
const passwordController = require("../controller/passwordController");

router.post("/userForgot",passwordController.user_forgot_password_post);


router.post("/instructorForgot",passwordController.instructor_forgot_password_post);

module.exports = router;