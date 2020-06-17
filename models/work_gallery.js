const mongoose=require("mongoose");
const WorkGallerySchema=mongoose.Schema({
    shop:{
        type:mongoose.Types.ObjectId,
        required:true,
        ref:"Shop"
    },
    date:{
        type:Date,
        default:Date.now()
    },
    caption:{
        type:String,
    },
    imageUrl:{
        type:String,
        required:true
    }

});
module.exports=mongoose.model("WorkGallery",WorkGallerySchema);