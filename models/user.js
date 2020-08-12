const mongoose=require('mongoose')
const userSchema=mongoose.Schema({
    firstName:{
        type:String
    },
    lastName:{
        type:String
    },
    gender:{
        type:String
    },
    dateOfBirth:{
        type:Date
    },
    language:{
        type:String
    },
    phone:{
        type:Number
    },
    alternatePhone:{
        type:Number
    },
    city:{
        type:String
    },
    zipCode:{
        type:Number
    },
    state:{
        type:String
    }
})

const User=mongoose.model("User",userSchema)

module.exports=User