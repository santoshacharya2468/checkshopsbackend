const mongoose=require("mongoose");
const UserSchema=mongoose.Schema({
    email:{
        type:String,
        require:true,
        unique:true,
    },
    password:{
        type:String,
        require:true,
    },
    registerdat:{
        type:Date,
        default:Date.now,
    },
    email_verified:{
        type:Boolean,
        default:false,
    },
});
module.exports=mongoose.model("User",UserSchema);