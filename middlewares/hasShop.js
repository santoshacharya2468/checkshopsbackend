const Shop=require("../models/shop");
const mongoose=require("mongoose");
const hasShop = async function (req, res, next) {
    try{
        let shop=await Shop.findOne({owner:mongoose.Types.ObjectId(req.user.id)});
        if(shop!=null){
            req.shop=shop;
            return next();
        }
        else{
            res.status(401).send({mesaage:"shop not found"});
        }
    }
    catch(e){
        res.status(401).send({mesaage:"shop not found"+e})
    }

};
module.exports = hasShop;
