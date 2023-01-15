const express = require("express")
const mongoose = require("mongoose");
require('dotenv').config();
const bodyParser = require("body-parser");
var path = require("path");

const cookieParser = require("cookie-parser");
const logger = require("morgan");

const multer = require("multer");


const cors = require("cors");
const app = express();

app.use(
  cors({
    origin: [
      "http://127.0.0.1:3000",
    ],
  })
);


//routes
const reiki = require("./routes/reiki");


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

app.set("view engine", "jade");

app.use(cors());

app.use(logger("dev"));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, "public")));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

//using routes
app.use("/reiki",reiki);
const addDataController = require("./controller/addData");
app.get("/setData",addDataController.set_benifits_info);
