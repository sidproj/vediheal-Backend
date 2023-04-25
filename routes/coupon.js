const express = require('express');
const router = express.Router();
const { requireAuth } = require("../middleware/authMiddleware");
const Coupon = require("../controller/coupon");

router.post("/check",Coupon.check_coupon);

module.exports = router;