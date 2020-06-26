const express = require("express");
const Shop = require("../models/shop");
const authorization = require("../middlewares/authorization");
const multer = require("multer");
var path = require("path");
const User = require("../models/user");
var fs = require("fs");
const perPage = 6;
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
var appDir = path.dirname(require.main.filename);
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.fieldname);
    // // console.log("here");
    // console.log(file);
    if (file.fieldname === "logo") {
      return cb(null, appDir + "/public/shops");
    } else if (file.fieldname === "profilePicture") {
      return cb(null, appDir + "/public/shops/profilepicture");
    } else if (file.fieldname === "profileVideo") {
      return cb(null, appDir + "/public/shops/profilevideo");
    }
    // cb(null, appDir + "/public/shops/profilevideo");
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "_" + file.originalname;
    if (file.fieldname === "logo") {
      req.logo = "/public/shops/" + filename;
    } else if (file.fieldname === "profilePicture") {
      req.profilePicture = "/public/shops/profilepicture/" + filename;
    } else if (file.fieldname === "profileVideo") {
      req.profileVideo = "/public/shops/profilevideo/" + filename;
    }
    // req.profileVideo = "public/shops/profilevideo/" + filename;

    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
//route to get all shops available in the database
router.get("/", async (req, res) => {
  let page = req.query.page || 1;
  //this route should be paginated
  try {
    var shops = await Shop.find()
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });

    if ((await Shop.count()) > perPage * page) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.json({ data: shops, perPage: perPage, next: nextPage });
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});

router.get("/myshop", authorization, async (req, res) => {
  try {
    var user = await User.findOne({ email: req.user.email }).select("+_id");
    var shop = await Shop.findOne({ owner: user.id }).populate("category");

    res.status(200).json(shop);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
router.get("/:catId", async (req, res) => {
  let page = req.query.page || 1;
  //this route should be paginated
  try {
    var shops = await Shop.find({ category: req.params.catId })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });
    if ((await Shop.count({ category: req.params.catId })) > perPage * page) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.json({ data: shops, perPage: perPage, next: nextPage });
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});
router.get("/:catId/:district", async (req, res) => {
  let page = req.query.page || 1;
  let district = req.params.district;
  //this route should be paginated
  try {
    var shops = await Shop.find({
      category: req.params.catId,
      district: district,
    })
      .populate("category")
      .skip((page - 1) * perPage)
      .limit(perPage)
      .sort({ _id: -1 });
    if (
      (await Shop.count({ category: req.params.catId, district: district })) >
      perPage * page
    ) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.json({ data: shops, perPage: perPage, next: nextPage });
  } catch (e) {
    res.status(500).send({ message: "server error" + e });
  }
});

//add new shops
router.post("/", upload.single("logo"), async (req, res) => {
  var { email, password } = req.body;
  try {
    let user = await User.findOne({ email: email });
    if (user == null) {
      try {
        let hashPassword = await bcrypt.hash(password, 10);
        try {
          req.body.password = hashPassword;
          let user = new User({ email: email, password: hashPassword });
          let result = await user.save();
          //from here start with shop registeration
          req.body.owner = result;
          req.body.activated = false;
          req.body.businessLogo = req.logo;
          req.body.packageDuration = {
            duration: req.body.duration,
            startOn: new Date(req.body.year, req.body.month, req.body.day),
          };

          try {
            let shop = new Shop(req.body);
            let result = await shop.save();
            res.status(201).send(result);
          } catch (e) {
            console.log(req.logo);
            fs.unlinkSync(appDir + req.logo);
            res.status(400).send(e);
          }
        } catch (e) {
          res.status(400).send(e);
        }
      } catch (e) {
        res
          .status(500)
          .send({ message: "error encrypting password try again" + e });
      }
    } else {
      res
        .status(409)
        .send({ message: `shop with  given email already in use` });
    }
  } catch (e) {
    res.status(500).send({ message: e });
  }

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

router.put(
  "/myshop/update",
  authorization,
  upload.single("logo"),
  async (req, res) => {
    try {
      var user = await User.findOne({ email: req.user.email }).select("+_id");
      var { body: newShop } = req;
      // if (newShop.colorIndex !== null) {
      //   var shop = await Shop.findOneAndUpdate(
      //     { owner: user.id },
      //     {
      //       $set: {
      //         "banner.colorIndex": newShop.colorIndex,
      //         "banner.showDiscount": newShop.showDiscount,
      //         "banner.selectProfile": newShop.selectProfile,
      //         discountPercent: newShop.discountPercent,
      //       },
      //     },
      //     { new: true }
      //   );
      // } else
      if (newShop.businessName !== null && req.logo !== undefined) {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          {
            $set: {
              businessName: newShop.businessName,
              businessLogo: req.logo,
              address: newShop.address,
              mobiles: newShop.mobiles,
              telephones: newShop.telephones,
              website: newShop.website,
              district: newShop.district,
            },
          },
          { new: true }
        ).populate("category");
        console.log(shop);
      } else if (newShop.businessName !== undefined && req.logo === undefined) {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          {
            $set: {
              businessName: newShop.businessName,
              address: newShop.address,
              mobiles: newShop.mobiles,
              telephones: newShop.telephones,
              website: newShop.website,
              district: newShop.district,
            },
          },
          { new: true }
        ).populate("category");
        console.log(shop);
      } else {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          { $set: { shopDescription: newShop.shopDescription } },
          { new: true }
        ).populate("category");
      }
      if (!shop) {
        return res.status(404).send({ message: "Internal Error" });
      }
      res.status(200).send(shop);
    } catch (error) {
      res.status(400).send({ message: error.message });
    }
  }
);

router.put(
  "/myshop/banner",
  authorization,
  upload.fields([
    { name: "profilePicture", maxCount: 2 },
    { name: "profileVideo", maxCount: 2 },
  ]),
  async (req, res) => {
    var user = await User.findOne({ email: req.user.email }).select("+_id");
    var { body: newShop } = req;
    var date = Date.now();
    // console.log(req);
    // console.log(req.profileVideo);
    // console.log(req.profilePicture);
    try {
      if (req.profilePicture != undefined && req.profileVideo != undefined) {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          {
            $set: {
              "banner.colorIndex": newShop.colorIndex,
              "banner.showDiscount": newShop.showDiscount,
              "banner.selectProfile": newShop.selectProfile,
              discountPercent: newShop.discountPercent,
              profilePicture: req.profilePicture,
              profileVideo: req.profileVideo,
              updatedDate: date,
            },
          },
          { new: true }
        ).populate("category");
      } else if (
        req.profilePicture == undefined &&
        req.profileVideo != undefined
      ) {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          {
            $set: {
              "banner.colorIndex": newShop.colorIndex,
              "banner.showDiscount": newShop.showDiscount,
              "banner.selectProfile": newShop.selectProfile,
              discountPercent: newShop.discountPercent,
              // profilePicture:req.profilePicture,
              profileVideo: req.profileVideo,
              updatedDate: date,
            },
          },
          { new: true }
        ).populate("category");
      } else if (
        req.profilePicture != undefined &&
        req.profileVideo == undefined
      ) {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          {
            $set: {
              "banner.colorIndex": newShop.colorIndex,
              "banner.showDiscount": newShop.showDiscount,
              "banner.selectProfile": newShop.selectProfile,
              discountPercent: newShop.discountPercent,
              profilePicture: req.profilePicture,
              updatedDate: date,
              //profileVideo: req.profileVideo,
            },
          },
          { new: true }
        ).populate("category");
      } else if (
        req.profilePicture == undefined &&
        req.profileVideo == undefined
      ) {
        var shop = await Shop.findOneAndUpdate(
          { owner: user.id },
          {
            $set: {
              "banner.colorIndex": newShop.colorIndex,
              "banner.showDiscount": newShop.showDiscount,
              "banner.selectProfile": newShop.selectProfile,
              discountPercent: newShop.discountPercent,
              // updatedDate: date,
              // profilePicture:req.profilePicture,
              // profileVideo:req.profileVideo,
            },
          },
          { new: true }
        ).populate("category");
      }

      if (!shop) {
        return res.status(404).send({ message: "Internal Error" });
      }
      res.status(200).send(shop);
    } catch (error) {
      res.status(400).json({ message: error.message });
    }
  }
);

module.exports = router;
