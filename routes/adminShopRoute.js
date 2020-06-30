const Shop = require("../models/shop");
const authorization = require("../middlewares/authorization");
var fs = require("fs");
const perPage = 18;
const express=require("express");
const router = express.Router();
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
      res.status(204);
    }
    catch(e){
      res.status(500).send(e);
    }
  });
  module.exports=router;
