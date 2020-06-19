const mongoose=require("mongoose");
const LikeSchema=mongoose.Schema({
    shop:{
        type:mongoose.Types.ObjectId,
        ref:"Shop",
        required:true,
    },
    likeDate:{
        type:Date,
        default:Date.now(),
    }
});
module.exports=mongoose.model("Like",LikeSchema);