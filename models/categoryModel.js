const mongoose = require("mongoose")


const categorySchma = new mongoose.Schema({
    name:{
        type:String,
        required:true,
        trim:true,
        unique:true
    }
},{
    timestamps:true //importent 
})

const categoryModel =  mongoose.model("category", categorySchma )

module.exports =categoryModel