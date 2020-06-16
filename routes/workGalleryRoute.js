const express = require("express");
const router = express.Router();
var path = require('path');
var appDir = path.dirname(require.main.filename);
const multer=require("multer");
const authorization=require("../middlewares/authorization");
const hasShop=require("../middlewares/hasShop");
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
    cb(null,appDir+"/public/gallery");
    },
    filename:(req,file,cb)=>{
        let filename=Date.now()+"_"+file.originalname;
            req.upload="/public/gallery/"+filename;
            cb(null,filename);
    }
});
const upload=multer({storage:storage});
const WorkGallery=require("../models/work_gallery");
//to get all deals;
//should use pagination;
router.get("/:shopId",async(req,res)=>{
    try{
        const gallery= await WorkGallery.find({shop:req.params.shopId}).sort({_id:-1});
        res.json(gallery);
    }
    catch(e){
       res.status(500).send({message:"Error retrieving workgallery"});
    }
});
router.get("/",authorization,hasShop,async(req,res)=>{
    try{
        const gallery= await WorkGallery.find({shop:req.shop}).sort({_id:-1});
        res.json(gallery);
    }
    catch(e){
       res.status(500).send({message:"Error retrieving workgallery"});
    }
});
//to create a new deal;
router.post("/",authorization,hasShop,upload.single("image"),async(req,res)=>{
    req.body.imageUrl=req.upload;
    req.body.shop=req.shop;
    let Gallery=new WorkGallery(
        req.body
    );
    try{
        var result=await Gallery.save();
        res.status(201).send(result);
    }
    catch(e){
        fs.unlinkSync(appDir + req.upload);
        res.status(400).send(e);
        res.status(400).send(e);
    }
});
module.exports=router;