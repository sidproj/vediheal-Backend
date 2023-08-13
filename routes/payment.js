const express = require('express');
const router = express.Router();

const {requireAuth} = require("../middleware/authMiddleware");

const payment = require("../controller/payment");

router.post("/create-payment-intent",requireAuth,payment.createPaymentIndent);

router.post("/create-order",requireAuth,(req,res)=>{
    res.send("pending");
})

module.exports = router;