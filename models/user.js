const mongoose=require('mongoose')
const Schema=mongoose.Schema


const passportlocalMongoose=require('passport-local-mongoose')
const plugin = passportlocalMongoose.default || passportlocalMongoose;

const userSchema=new Schema({
    email:{
        type:String,
        required:true
    }
})

userSchema.plugin(plugin)
module.exports=mongoose.model("User",userSchema)