const express = require("express");
const Shop=require("../models/shop");
const authorization=require("../middlewares/authorization");
const multer=require("multer");
var path = require('path');
const User=require("../models/user");
var fs=require("fs");
const jsonwebtoken = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = express.Router();
var appDir = path.dirname(require.main.filename);
const storage=multer.diskStorage({
    destination:(req,file,cb)=>{
        cb(null,appDir+"/public/shops");
    },
    filename:(req,file,cb)=>{
        let filename=Date.now()+"_"+file.originalname;
            req.logo="/public/shops/"+filename;
            cb(null,filename);
    }
});
const upload=multer({storage:storage});
//route to get all shops available in the database
router.get("/",async(req,res)=>{
    
    //this route should be paginated
    try{
      var shops=await Shop.find().populate("category").sort({_id:-1});
      res.json(shops);
    
    }
    catch(e){
        res.status(500).send({message:"server error"});
    }
});
//add new shops
router.post("/",upload.single("logo"),async(req,res)=>{
      var { email, password} = req.body;
    try {
        let user = await User.findOne({ email: email });
        if (user == null) {
            try {
                let hashPassword = await bcrypt.hash(password, 10);
                try {
                    req.body.password = hashPassword;
                    let user = new User({ email: email, password: hashPassword});
                    let result = await user.save();
                    //from here start with shop registeration
                    req.body.owner=result;
                    req.body.activated=false;
                    req.body.businessLogo=req.logo;
                    req.body.packageDuration={duration:req.body.duration,startOn:new Date(req.body.year,req.body.month,req.body.day)};

                    try{
                        let shop=new Shop(req.body);
                        let result=await shop.save();
                        res.status(201).send(result);
                            }
                            catch(e){
                                console.log(req.logo);
                                fs.unlinkSync(appDir+req.logo);
                                res.status(400).send(e);
                            }
                }
                catch (e) {
                    res.status(400).send(e);
                }
            }
            catch (e) {
                res.status(500).send({ message: "error encrypting password try again"+e });

            }

        }
        else {
            res.status(409).send({ message: `shop with  given email already in use` });
        }
    }
    catch (e) {
res.status(500).send({ message:e});
    }
   

});
module.exports=router;