const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const Coupon = require("../controller/coupon");

router.post("/check",Coupon.check_coupon);

router.post("/contactus",Coupon.contact_us_mail);

module.exports = router;