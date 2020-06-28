const express = require("express");
const router = express.Router();
const authorization = require("../middlewares/authorization");
const Click = require("../models/click");
const Shop = require("../models/shop");
const hasShop = require("../middlewares/hasShop");
router.post("/:shopId", async (req, res) => {
    try {
        var click = new Click({
            shop: req.params.shopId
        });
        var result = await click.save();
        res.status(200).send({ message: "Added to click" });
    }
    catch (e) {
        res.status(500).send();
    }

});
router.get("/", authorization, hasShop, async (req, res) => {
    try {
        // var clicks = await Click.find({ shop: req.shop });
        // res.send(clicks);
        var result=await Click.find({shop:req.shop}).sort({clickDate:-1});
       // res.send(result);
        if(result.length>0){
            var data=[];
            var startDate=result[0].clickDate;
            var count=0;
            var index=0;
            var datalength=result.length;
        for(var i=0;i<datalength;i++){
           var nday= result[i].clickDate;
            index+=1;
            if(startDate.getDay()!=result[i].clickDate.getDay()){
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
router.get("/all", authorization,  async (req, res) => {
    try {
        // var clicks = await Click.find({ shop: req.shop });
        // res.send(clicks);
        var result=await Click.find().sort({clickDate:-1});
       // res.send(result);
        if(result.length>0){
            var data=[];
            var startDate=result[0].clickDate;
            var count=0;
            var index=0;
            var datalength=result.length;
        for(var i=0;i<datalength;i++){
           var nday= result[i].clickDate;
            index+=1;
            if(startDate.getDay()!=result[i].clickDate.getDay()){
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