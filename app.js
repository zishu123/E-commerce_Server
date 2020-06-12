require("dotenv").config();

const express = require("express");
const mongoose = require("mongoose");
const app = express();
const port = 8000;
const bodyParser = require("body-parser");
const cookieParser = require("cookie-parser");
const cors = require("cors");

//My routes
const authRoute = require("./routes/auth");
const userRoute = require("./routes/user")
const categoryRoute = require("./routes/category")
const productRoute = require("./routes/product")
const orderRoute = require("./routes/order")
mongoose.connect(
  process.env.DATABASE,
  {
    useNewUrlParser: true,
    useCreateIndex: true,
    useUnifiedTopology: true,
  },
  (err) => {
    if (err) throw err;
    console.log("DB CONNECTED");
  }
);
app.use(bodyParser.json());
app.use(cookieParser());
app.use(cors())
//my routes
app.use('/api',authRoute);
app.use('/api',userRoute);
app.use('/api',categoryRoute);
app.use('/api',productRoute);
app.use('/api',orderRoute);
app.listen(port, (err) => {
  if (err) throw err;
  console.log(`Server listening at port ${port}`);
});