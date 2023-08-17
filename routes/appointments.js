const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const Appointment = require("../controller/appointments");
const Instructor = require('../controller/instructor');

router.post("/user/upcoming",requireAuth,Appointment.user_upcoming_appointments_get);
router.post("/user/previous",requireAuth,Appointment.user_previous_appointments_get);

router.post("/instructor",requireAuth,Appointment.instructor_appointments_get);
router.post("/instructor/complete",requireAuth,Appointment.instructor_appointments_complete);

router.post("/set",requireAuth,Appointment.set_appointments_post);
router.post("/changeLink",requireAuth,Appointment.set_meeting_link);
// router.get("/",Appointment.testMail);


module.exports = router;