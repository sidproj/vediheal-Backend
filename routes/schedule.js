const express = require('express');
const router = express.Router();
const scheduleController = require("../controller/schedule");

const { requireAuth } = require("../middleware/authMiddleware");

router.post("/",requireAuth,scheduleController.get_instructor_schedules);
router.post("/createSchedule",requireAuth,scheduleController.create_schedule);
router.post("/deleteSchedule",requireAuth,scheduleController.delete_schedule);

module.exports = router;