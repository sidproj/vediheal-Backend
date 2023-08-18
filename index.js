const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var path = require("path");
const logger = require("morgan");
const cors = require("cors");


//routes
const reiki = require("./routes/reiki");
const appointment = require("./routes/appointments");
const login = require("./routes/login");
const register = require("./routes/register");
const profile = require("./routes/profile");
const password = require("./routes/password");
const admin = require("./routes/admin");
const review = require("./routes/review");
const schedule = require("./routes/schedule");
const coupon = require("./routes/coupon");
const payment = require("./routes/payment");

const app = express();

// app.options('*', cors());
app.use(
  cors({
    // origin:["*","http://192.168.1.12:3000","http://localhost:3000"],
    origin:["https://vediheal-kbc5.vercel.app/"],
  })
);

app.use(express.static(__dirname + "/public"));

//database connection with mongoose
mongoose.set('strictQuery', false);
mongoose
  .connect(process.env.MONGODBURI)
  .then(() => {
    const port = process.env.PORT || 5000;
    // const host = process.env.HOST || "0.0.0.0";
    app.listen(port);
    console.log(`listening on port ${port}`);
  })
  .catch((err) => {
    console.log("Error while connecting to mongoose");
    console.log(err, err.message);
  });

// view engine setup

app.set('views', __dirname + '/views');
app.set("view engine", "ejs");

app.use(logger("dev"));
app.use(express.urlencoded());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());

//using routes

// app.use("/addData",addData);

app.get("/",(req,res)=>{
  res.send("welcome to vediheal backend");
})

app.use("/review",review);
//testing---------------
//----------------------

//done------------------

app.use("/password",password);
app.use("/admin",admin);
app.use("/reiki",reiki);
app.use("/profile",profile);
app.use("/register",register);
app.use("/login",login);
app.use("/appointment",appointment);
app.use("/schedule",schedule);
app.use("/coupon",coupon);
app.use("/payment",payment)
//----------------------