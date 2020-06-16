const express = require("express");
const router = express.Router();
const authorization=require("../middlewares/authorization");
const Click=require("../models/click");
const Shop=require("../models/shop");
router.post("/:shopId",async(req,res)=>{
    try{
        var click=new Click({
            shop:req.params.shopId
        });
        var result=await click.save();
        res.status(200).send({message:"Added to click"});
    }
    catch(e){
        res.status(500).send();
    }

});
router.get("/",authorization,async(req,res)=>{
    try{
        var shop=await Shop.find({owner:req.user.id});
        // var result=await Click.find({shop:shop});
        // res.send(result);
    Click.aggregate(
        [
           {
               $project: {
                      $yearMonthDay: { $dateToString: { format: "%Y-%m-%d", date: Date.now() } },
                      time: { $dateToString: { format: "%H:%M:%S:%L", date: Date.now() } }
               }
           }
        ]
      ).then(e=>{
        res.send(e);
      });
      
     
      
    }
    catch(e){
        res.status(500).send(e);
    }

});
module.exports=router;