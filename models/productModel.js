const mongoose = require("mongoose")



const productSchema = new mongoose.Schema({
    product_id:{
        type : String,
        required: true,
        trim:true,
        unique:true
    },  tittle:{
        type : String,
        required: true,
        trim:true
    },  price:{
        type : Number,
        required: true,
        trim:true
    }, description:{
        type : String,
        required: true
    },content:{
        type : String,
        required: true
    }, images:{
        type :Object,
        required: true
    },category:{
        type : String,
        required: true
    },checked:{
        type : Boolean,
        default: false
    },sold:{
        type : Number,
        default: 0
    }
},{
    timestamps : true
})

const productModel = mongoose.model("Product", productSchema)

module.exports = productModel;