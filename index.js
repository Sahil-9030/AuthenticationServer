const express = require("express");
const app = express();
const cookieParser = require("cookie-parser");

app.use(cookieParser());
require("dotenv").config();

const PORT = process.env.PORT || 8000;

app.use(express.json());

require("./config/database").connect();

// route import and mount
const user = require("./routes/user");
app.use("/api/v1",user);

app.listen(PORT,()=>{
    console.log(`App is listining at ${PORT}`);
})