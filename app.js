const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");
const authRoutes = require("./routes/auth");
const userRoutes = require("./routes/user");

//DB Connection
mongoose.connect(process.env.DATABASE , {
    useNewUrlParser : true,
    useUnifiedTopology : true,
    useCreateIndex : true
}).then(()=>{
    console.log("DB CONNECTED");
}).catch(()=>{
    console.log("DB GOT OOOPSS");
})

//Middleware
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors());


//My Routes
app.use("/api" , authRoutes);
app.use("/api" , userRoutes);



//Port
const port = process.env.PORT || 8000;

//Server Listening / Running
app.listen(port , () =>{
    console.log(`app is running at ${port}`);
})