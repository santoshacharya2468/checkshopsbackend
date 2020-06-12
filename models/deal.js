const mongoose=require("mongoose");
const dealSchema=mongoose.Schema({
    shop:{
        type:mongoose.Types.ObjectId,
        ref:"Shop",
    },
    mediaUrl:{
        type:String,
    },
    caption:{
        type:String,
    },
    bannerImage:{
        type:String,
        required:true,
    }
});
module.exports=mongoose.model("Deal",dealSchema);