const express = require("express");
const mongoose = require("mongoose");
const dotenv = require("dotenv");
var morgan = require("morgan");
const path = require("path");
const Shop = require("./models/shop");
//middleware
const appMiddleware = require("./middlewares/appmiddleware");
//models
const User = require("./models/user");
dotenv.config();
const app = express();
app.use("/public", express.static(path.join(__dirname, "public")));

mongoose.connect(process.env.dbCon, {
  useUnifiedTopology: true,
  useNewUrlParser: true,
  useCreateIndex: true,
});
app.use(morgan("tiny"));

app.listen(process.env.PORT||8080, () =>
  console.log(`Server running on port ..${process.env.PORT}`)
);

app.use(express.json());

//routes
const accountRoute = require("./routes/accountRoute");
const shopRoute = require("./routes/shopRoute");
const dealRoute = require("./routes/dealRoute");
const categoryRoute = require("./routes/categoryRoute");
app.use("/account", appMiddleware, accountRoute);
app.use("/shop", appMiddleware, shopRoute);
app.use("/category", appMiddleware, categoryRoute);
app.use("/deal", appMiddleware, dealRoute);
app.get("/search/:query", async (req, res) => {
  //this route should be paginated
  try {
    var shops = await Shop.find({businessName: { $regex: req.params.query, $options: "i" },})
     .populate("category")
     .limit(20);
    res.json(shops);
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});