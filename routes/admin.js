const express = require('express');
const router = express.Router();

const { requireAuthAdmin } = require("../middleware/authMiddleware");
const adminController = require("../controller/admin");

//authentication Routes
router.get("/login",adminController.login_get);
router.post("/login",adminController.login_post);
router.get("/logout",requireAuthAdmin,adminController.logout_get);

//admin profile
router.get("/profile",requireAuthAdmin,adminController.profile_get);
router.post("/profile",requireAuthAdmin,adminController.edit_admin);
router.post("/profile/password",requireAuthAdmin,adminController.change_admin_password)

//human entities
router.get("/instructors",requireAuthAdmin,adminController.instructors_get);
router.get("/instructors/:id",requireAuthAdmin,adminController.instructor_get);

router.get("/block/instructor/:id",requireAuthAdmin,adminController.block_instructor);
router.get("/unblock/instructor/:id",requireAuthAdmin,adminController.unblock_instructor);
router.post("/edit/instructor/:id",requireAuthAdmin,adminController.edit_instructor);

//users
router.get("/users",requireAuthAdmin,adminController.users_get);
router.get("/users/:id",requireAuthAdmin,adminController.user_get);
router.get("/block/user/:id",requireAuthAdmin,adminController.block_user);
router.get("/unblock/user/:id",requireAuthAdmin,adminController.unblock_user);

//reikies
router.get("/reikies",requireAuthAdmin,adminController.reikis_get);
router.get("/reikies/:id",requireAuthAdmin,adminController.reiki_get);
router.post("/edit/reiki/:id",requireAuthAdmin,adminController.edit_reiki_post);
router.get("/change/reiki/:id",requireAuthAdmin,adminController.change_reiki_status);
router.get("/add/reiki",requireAuthAdmin,adminController.add_reiki_get);
router.post("/add/reiki",requireAuthAdmin,adminController.add_reiki_post);

//appointments
router.get("/appointments",requireAuthAdmin,adminController.appointments_get);
router.get("/appointments/:id",requireAuthAdmin,adminController.appointment_get);

//benifits
router.get("/benifits",requireAuthAdmin,adminController.benifits_get);
router.get("/benifits/:id",requireAuthAdmin,adminController.benifit_get);
router.post("/add/benifit",requireAuthAdmin,adminController.add_benifit);
router.post("/edit/benifit/:id",requireAuthAdmin,adminController.edit_benifit);
router.get("/change/benifit/:id",requireAuthAdmin,adminController.change_benifit_status);


module.exports = router;