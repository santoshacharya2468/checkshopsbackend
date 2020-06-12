const express = require("express");
const router = express.Router();
var path = require('path');
var appDir = path.dirname(require.main.filename);
const multer=require("multer");
const authorization=require("../middlewares/authorization");
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
router.get("/",async(req,res)=>{
    try{
        const deals= await Deal.find();
        res.json(deals);
    }
    catch(e){
       res.status(500).send({message:"Error retrieving deals"});
    }
});
router.post("/",authorization,upload.single("bannerImage"),async(req,res)=>{
    req.body.bannerImage=req.upload;
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