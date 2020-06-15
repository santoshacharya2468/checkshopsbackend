const express = require("express");
const router = express.Router();
var path = require('path');
var appDir = path.dirname(require.main.filename);
const multer=require("multer");
const authorization=require("../middlewares/authorization");
const hasShop=require("../middlewares/hasShop");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
    cb(null,appDir+"/public/deals");
    },
    filename:(req,file,cb)=>{
        let filename=Date.now()+"_"+file.originalname;
            req.upload="/public/deals/"+filename;
            cb(null,filename);
    }
});
const upload=multer({storage:storage});
const Deal=require("../models/deal");
//to get all deals;
//should use pagination;
router.get("/",async(req,res)=>{
    try{
        const deals= await Deal.find().sort({_id:-1});
        res.json(deals);
    }
    catch(e){
       res.status(500).send({message:"Error retrieving deals"});
    }
});
router.get("/:shopId",async(req,res)=>{
    try{
        const deals= await Deal.find({shop:req.params.shopId}).sort({_id:-1});
        res.json(deals);
    }
    catch(e){
       res.status(500).send({message:"Error retrieving deals"});
    }
});
//get deals based upon the category;
router.get("/:catId",async(req,res)=>{
    try{
        const deals= await Deal.find();
        res.json(deals);
    }
    catch(e){
       res.status(500).send({message:"Error retrieving deals"});
    }
});
//to create a new deal;
router.post("/",authorization,hasShop,upload.single("bannerImage"),async(req,res)=>{
    req.body.bannerImage=req.upload;
    req.body.shop=req.shop;
    let deal=new Deal(
        req.body
    );
    try{
        var result=await deal.save();
        res.status(201).send(result);
    }
    catch(e){
        res.status(400).send(e);
    }
});
module.exports=router;