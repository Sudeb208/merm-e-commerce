const Payments = require("../models/paymentModel")
const User = require("../models/userModel")
const Products = require("../models/productModel")


const paymentctrl={
    getPayments : async (req, res) =>{
        try {
            const payments = await Payments.find()
            res.json(payments)
        } catch (error) {
           res.status(500).json({msg: error.message}) 
        }
    },
    createPayment: async(req, res)=>{
        try {
            const user = await User.findById(req.user.id).select('name email')
            // console.log(req.user.id)
            if(!user) return res.status(400).json({msg:"USer dose not exit"})

            const {cart, paymentID, address} = req.body; 
            const {_id, name, email} = user;
            const newPayment= new Payments({ 
                user_id:_id,name,email,cart, paymentID, address
            })

            console.log(cart)

            cart.filter(item => {
                return sold(item._id, item.quantity, item.sold)
            })
            await newPayment.save()

            res.json({msg: "Payment SuccessFull"})


        } catch (error) {
            res.status(500).json({msg: error.message}) 
        }
    }

}


const sold = async(id, quantity, oldSold) =>{
    await Products.findByIdAndUpdate({_id: id}, {
        sold: quantity + oldSold
    })
} 

module.exports = paymentctrl;