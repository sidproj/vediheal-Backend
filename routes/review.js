const express = require("express");
const router = express.Router();
const {requireAuth} = require("../middleware/authMiddleware");
const reviewController = require("../controller/reviews");

router.post("/",requireAuth,reviewController.send_review);

module.exports = router;