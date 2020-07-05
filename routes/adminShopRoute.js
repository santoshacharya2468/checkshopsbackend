const Shop = require("../models/shop");
const authorization = require("../middlewares/authorization");
var fs = require("fs");
const perPage = 18;
const express=require("express");
const router = express.Router();
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
//activate or deactivate a shop
router.patch("/:shopId",authorization,async(req,res)=>{
    try{
      await Shop.findByIdAndUpdate(req.params.shopId,{activated:req.body.status});
      res.send(await Shop.findById(req.params.shopId));
    }
    catch(e){
      res.status(500).send(e);
    }
  });
  //delete a shop with given  id
  router.delete("/:shopId",authorization,async(req,res)=>{
    try{
      await Shop.findByIdAndRemove(req.params.shopId);
      res.status(204).send();
    }
    catch(e){
      res.status(500).send(e);
    }
  });
  module.exports=router;
