const express=require("express");
const router=express.Router();
const Category=require("../models/category");
const Like=require("../models/like");
const Click=require("../models/click");
const Shop=require("../models/shop");
router.get("/dashboard",async(req,res)=>{
    try{
        var categoryCount=await Category.count();
        var likeCount=await Like.count();
        var clickCount=await Click.count();
        var shopCount=await Shop.count();
        res.json({categories:categoryCount,likes:likeCount,clicks:clickCount,providers:shopCount});
    }
    catch(e){
        res.status(500).send({message:"Error retrieving dashboard"});
    }

});
module.exports=router;