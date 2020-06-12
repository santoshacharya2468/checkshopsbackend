const express = require("express");
const Shop = require("../models/shop");
const Category = require("../models/category");
const authorization = require("../middlewares/authorization");
const multer = require("multer");
var path = require("path");
var fs = require("fs");
const router = express.Router();
var appDir = path.dirname(require.main.filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appDir + "/public/shops");
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "_" + file.originalname;
    req.logo = filename;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
//route to get all shops available in the database
router.get("/", async (req, res) => {
  //this route should be paginated
  try {
    var shops = await Shop.find();
    //.sort({ _id: -1 });
    //.populate("categories");
    console.log("here");
    console.log(shops);
    res.json(shops);
  } catch (e) {
    console.log(e.message);
    res.status(500).send({ message: "server error" });
  }
});
//add new shops
router.post("/", authorization, upload.single("logo"), async (req, res) => {
  req.body.owner = req.user.id;
  req.body.activated = false;
  req.body.businessLogo = req.logo;
  req.body.packageDuration = {
    duration: req.body.duration,
    startOn: new Date(req.body.year, req.body.month, req.body.day),
  };

  // req.body.packageDuration.startOn=new Date(req.body.year,req.body.month,req.body.day);
  try {
    let shop = new Shop(req.body);
    let result = await shop.save();
    res.status(201).send(result);
  } catch (e) {
    console.log(req.logo);
    fs.unlinkSync(appDir + "/public/shops/" + req.logo);
    res.status(400).send(e);
  }
});
module.exports = router;
