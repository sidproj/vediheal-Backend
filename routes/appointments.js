const express = require('express');
const router = express.Router();
const { requireAuth, requireAuthAdmin } = require("../middleware/authMiddleware");
const Appointment = require("../controller/appointments");
const Instructor = require('../controller/instructor');

router.post("/user",requireAuth,Appointment.user_appointments_get);

router.get("/instructor",requireAuth,Appointment.instructor_appointments_get);

router.post("/set",requireAuth,Appointment.set_appointments_post);

router.post("/slots",requireAuth,Instructor.set_time_slots);

module.exports = router;