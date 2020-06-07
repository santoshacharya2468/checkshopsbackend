const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
//middleware
const appMiddleware=require("./middlewares/appmiddleware");
//models
const User=require("./models/user");
dotenv.config();
const app = express();
const port = 8080;
mongoose.connect(process.env.dbCon, {
    useUnifiedTopology: true,
    useNewUrlParser: true,
    useCreateIndex:true,
});
app.listen(process.env.port, () => console.log(`Server running on port ..${process.env.port}`));
app.use(express.json());
app.use(appMiddleware);
//routes
const accountRoute=require("./routes/accountRoute");
app.use("/account",accountRoute);