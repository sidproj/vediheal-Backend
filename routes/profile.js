const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const userController = require("../controller/user");
const instructorController = require("../controller/instructor");

router.post("/user",requireAuth,userController.profile_get);
router.post("/edit/user",requireAuth,userController.profile_post);
router.post("/edit/user/password",requireAuth,userController.change_password);


router.post("/instructor",requireAuth,instructorController.profile_get);
router.post("/edit/instructor",requireAuth,instructorController.profile_post);
router.post("/edit/instructor/password",requireAuth,instructorController.change_password);


module.exports = router;