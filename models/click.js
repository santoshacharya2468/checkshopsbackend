const mongoose=require("mongoose");
const ClickSchema=mongoose.Schema({
    shop:{
        type:mongoose.Types.ObjectId,
        ref:"Shop",
        required:true,
    },
    clickDate:{
        type:Date,
        default:Date.now(),
    }
});
module.exports=mongoose.model("Click",ClickSchema);