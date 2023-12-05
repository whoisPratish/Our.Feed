const express = require("express");
var bodyParser = require("body-parser");
const app = express();
const multer = require("multer");
const path = require("path");
const cookieParser = require("cookie-parser");
app.set("view engine", "ejs");
app.set("views", "views");

//initialize mongodb connection
const connection = require("./database/connection");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cookieParser());


const routes = require("./routes/route");
const authRoute = require("./routes/authRoute");
//routes

app.use("/auth", authRoute);
app.use(routes);
//listen to 8080 port
app.listen(8080, () => {
    console.log('Server is running on port 8080');
    
});
