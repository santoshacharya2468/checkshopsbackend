const mongoose = require("mongoose");
const express = require("express");
const router = express.Router();
var path = require("path");
var appDir = path.dirname(require.main.filename);
const multer = require("multer");
var fs = require("fs");
const authorization = require("../middlewares/authorization");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, appDir + "/public/categories");
  },
  filename: (req, file, cb) => {
    let filename = Date.now() + "_" + file.originalname;
    req.upload = "/public/categories/" + filename;
    cb(null, filename);
  },
});
const upload = multer({ storage: storage });
const Category = require("../models/category");
router.get("/", async (req, res) => {
  try {
    const categories = await Category.find();

    res.json(categories);
  } catch (e) {
    res.status(500).send({ message: "Error retrieving categories" });
  }
});
router.post("/", authorization, upload.single("icon"), async (req, res) => {
  let alreadcategory = await Category.findOne({ name: req.body.name });
  if (alreadcategory == null) {
    let category = new Category({
      name: req.body.name,
      icon: req.upload,
    });
    try {
      var result = await category.save();
      res.status(201).send(result);
    } catch (e) {
      res.status(400).send(e);
    }
  } else {
    res
      .status(409)
      .send({ message: "A Category with given name already exits" });
  }
});
router.delete("/:catId", authorization,async (req, res) => {
  try{
    var category=await Category.findById(req.params.catId);
    var result=await Category.findByIdAndRemove(req.params.catId);
    try{
      fs.unlinkSync(appDir +category.icon);
      }
      catch(e){}
      res.status(204).send();
  }
  catch(e){
    res.status(500).json({message:"Error deleting category"});
  }
  });
  router.patch("/:catId", authorization, upload.single("icon"), async (req, res) => {
    let alreadcategory = await Category.findOne({ _id: req.params.catId });
    if (alreadcategory != null) {
      try {
        var result = await Category.findByIdAndUpdate(req.params.catId,{name: req.body.name,icon: req.upload||alreadcategory.icon});
        console.log(`${req.upload} upload`);
        if(req.upload==null){
          try{
          
            fs.unlinkSync(appDir +alreadcategory.icon);
            }
            catch(e){
              console.log(e);
            }
        }
       
        res.status(201).send(await Category.findById(req.params.catId));
      } catch (e) {
        res.status(400).send(e);
      }
    }
     else {
      res
        .status(404)
        .send({ message: "Category does not exists" });
    }
  });

module.exports = router;
