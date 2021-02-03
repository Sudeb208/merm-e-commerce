const mongose = require('mongoose')


const paymentSchma = new mongose.Schema({
    user_id:{
        type:String,
        required:true
    },
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true
    },
    paymentID:{
        type:String,
        required:true
    },
    address:{
        type:Object,
        required:true
    },
    cart:{
        type:[Array],
        default:[]
    },
    status:{
        type:Boolean,
        default:false
    }
},{
    timestamps : true
})

const PaymentModel = mongose.model('Payment', paymentSchma)

module.exports = PaymentModel ;