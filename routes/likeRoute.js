const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization");
const Like = require("../models/like");
const Shop = require("../models/shop");
const hasShop = require("../middlewares/hasShop");
router.post("/:shopId", async (req, res) => {
    try {
        var like = new Like({
            shop: req.params.shopId
        });
        var result = await like.save();
        res.status(200).send({ message: "Added to Like" });
    }
    catch (e) {
        res.status(500).send(e);
    }

});
router.get("/", authorization, hasShop, async (req, res) => {
    try {
        // var Likes = await Like.find({ shop: req.shop });
        // res.send(Likes);
        var result=await Like.find({shop:req.shop}).sort({likeDate:-1});
        if(result.length>0){
            var data=[];
            var startDate=result[0].likeDate;
            var count=0;
            var index=0;
            var datalength=result.length;
        for(var i=0;i<datalength;i++){
           
           var nday= result[i].likeDate;
            index+=1;
    
            if(startDate.getDay()!=result[i].likeDate.getDay()){
                
                data.push({date:startDate,count:count});
                count=1;
                startDate=nday;
                if(index==datalength){
                  data.push({date:startDate,count:count});
                }
              }
              else{
                count+=1;
                if(index==datalength){
                  data.push({date:startDate,count:count});
                }
                
              }
           
        }
        res.send(data);
    }else{
        res.send(result);
    }



    }
    catch (e) {
        res.status(500).send(e);
    }

});
router.get("/all", authorization, async (req, res) => {
    try {
        // var Likes = await Like.find({ shop: req.shop });
        // res.send(Likes);
        var result=await Like.find().sort({likeDate:-1});
        if(result.length>0){
            var data=[];
            var startDate=result[0].likeDate;
            var count=0;
            var index=0;
            var datalength=result.length;
        for(var i=0;i<datalength;i++){
           
           var nday= result[i].likeDate;
            index+=1;
    
            if(startDate.getDay()!=result[i].likeDate.getDay()){
                
                data.push({date:startDate,count:count});
                count=1;
                startDate=nday;
                if(index==datalength){
                  data.push({date:startDate,count:count});
                }
              }
              else{
                count+=1;
                if(index==datalength){
                  data.push({date:startDate,count:count});
                }
                
              }
           
        }
        res.send(data);
    }else{
        res.send(result);
    }



    }
    catch (e) {
        res.status(500).send(e);
    }

});
module.exports = router;