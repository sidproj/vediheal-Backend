const express = require('express');
const router = express.Router();
const addDataController = require("../controller/addData");

/* GET home page. */
// router.get('/reikiAdd', reikiController.get_all_reikies);

router.get("/",addDataController.add_instructor_reiki);

router.get("/getAppointmentDetails",addDataController.get_appointment_details);

router.get("/addBenifitsToReiki",addDataController.add_benifits_to_reiki);

router.get("/userAdd",addDataController.add_user);

router.get("/instructorAdd",addDataController.add_instructor);

// router.get("/appointmentAdd",async (req,res)=>{
//     const 
//     res.send("Done");
// });

module.exports = router;