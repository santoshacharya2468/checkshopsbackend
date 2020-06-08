const mongoose=require("mongoose");
const productCategorySchema=mongoose.Schema({
    name:{
        type:String,
        required:true,
    },

});
module.exports=mongoose.model("ProductCategory",productCategorySchema);