const express = require("express");
const router = express.Router();
var path = require("path");
var appDir = path.dirname(require.main.filename);
const multer = require("multer");
const authorization = require("../middlewares/authorization");
const hasShop = require("../middlewares/hasShop");
const perPage = 5;
const User = require("../models/user");
const Shop = require("../models/shop");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    console.log(file.fieldname);
    if (file.fieldname === "profileVideo") {
      cb(null, appDir + "/public/deals/profilevideo/");
    } else if (file.fieldname === "profilePicture") {
      cb(null, appDir + "/public/deals/profilepicture/");
    }
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "_" + file.originalname;
    if (file.fieldname === "profileVideo") {
      req.profileVideo = "/public/deals/profilevideo/" + filename;
    } else if (file.fieldname === "profilePicture") {
      req.profilePicture = "/public/deals/profilepicture/" + filename;
    }
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
const Deal = require("../models/deal");
//to get all deals;
//should use pagination;
// router.get("/", async (req, res) => {
//   try {
//     const deals = await Deal.find().limit(8).sort({ _id: -1 });
//     res.json(deals);
//   } catch (e) {
//     res.status(500).send({ message: "Error retrieving deals" });
//   }
// });
// router.get("/alldeals", async (req, res) => {
//   try {
//     const deals = await Deal.find().sort({ _id: -1 });
//     res.json(deals);
//   } catch (e) {
//     res.status(500).send({ message: "Error retrieving deals" });
//   }
// });
// router.get("/:shopId", async (req, res) => {
//   try {
//     const deals = await Deal.find({ shop: req.params.shopId }).sort({
//       _id: -1,
//     });
//     res.json(deals);
//   } catch (e) {
//     res.status(500).send({ message: "Error retrieving deals" });
//   }
// });
// get deals based upon the category;
// router.get("/:catId", async (req, res) => {
//   try {
//     const deals = await Deal.find();
//     res.json(deals);
//   } catch (e) {
//     res.status(500).send({ message: "Error retrieving deals" });
//   }
// });

//get the latest deals
router.get("/latestdeals", async (req, res) => {
  var page = req.query.page || 1;

  try {
    var deals = await Deal.find()
      .limit(perPage)
      .skip((page - 1) * perPage)
      .sort({ _id: -1 });
    if ((await Deal.count()) > perPage * page) {
      var nextPage = Number(page) + 1;
    } else {
      nextPage = null;
    }
    res.status(200).json({ deals: deals, next: nextPage });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});
//to create a new deal;
// router.post(
//   "/",
//   authorization,
//   hasShop,
//   upload.,
//   async (req, res) => {
//     req.body.bannerImage = req.upload;
//     req.body.shop = req.shop;
//     let deal = new Deal(req.body);
//     try {
//       var result = await deal.save();
//       res.status(201).send(result);
//     } catch (e) {
//       res.status(400).send(e);
//     }
//   }
// );
router.post(
  "/",
  authorization,
  upload.fields([
    { name: "profileVideo", maxCount: 2 },
    { name: "profilePicture", maxCount: 2 },
  ]),
  async (req, res) => {
    var user = await User.findOne({ email: req.user.email }).select("+_id");
    console.log(req.body);
    console.log(req.profilePicture);

    var shop = await Shop.findOne({ owner: user.id }).select("+_id");
    req.shop = shop.id;
    req.body.profileVideo = req.profileVideo;
    req.body.profilePicture = req.profilePicture;
    if (req.profileVideo !== undefined || req.profilePicture !== undefined) {
      var deal = new Deal(req.body);
      try {
        var result = Deal.save();
        return res.staus(200).send(result);
      } catch (error) {
        return res.status(400).send({ message: error.message });
      }
    } else {
      return res.status(200).send();
    }
  }
);
module.exports = router;
