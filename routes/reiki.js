const express = require('express');
const router = express.Router();
const reikiController = require("../controller/reiki");
const instructorController = require("../controller/instructor");

const { requireAuth } = require("../middleware/authMiddleware");

/* GET home page. */
router.get('/', reikiController.get_all_reikies);

router.get("/single/:id",reikiController.get_one_reikies);

router.get("/instructor",instructorController.get_all_instructors);

router.get("/instructor/:id",reikiController.get_one_instructor);

router.post("/addReiki",requireAuth,instructorController.add_reiki_post);

router.post("/instructorsByReiki",instructorController.get_all_instructors_by_reiki);

module.exports = router;