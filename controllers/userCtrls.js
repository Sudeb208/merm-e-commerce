const User = require("../models/userModel")
const Payment = require("../models/paymentModel")
const bcrypt = require("bcrypt")
const jwt = require("jsonwebtoken");


const userCtrl = {
 register: async (req, res)=>{
     try {
         const {name, email,password} = req.body;

         const user = await User.findOne({email})
         if(user) return res.status(400).json({msg: "the email already exists"})
         if(password.length <6)
         return res.status(400).json({msg: "Password is at least 6 characters long"})
         
         //password encryption
        const passwordHash = await bcrypt.hash(password, 10)
        const newUser = new User({
            name,email, password:passwordHash
        });
         //save mongodb
        await newUser.save()

        //create jsonwebtoken to authentication 
         const accesstoken = createAccessToken({id: newUser._id})
         const refreshtoken = createRefreshToken({id: newUser._id})
         
         res.cookie('refreshtoken', refreshtoken, {
             httpOnly :true,
             path:'/user/refresh_token',
             maxAge:7*24*60*1000 //7d
         })
        
        //  res.json({msg: "Register successfull!"})
        res.json(accesstoken)

     } catch (error) {
      res.status(500).json({msg: error.message})
     }
 },
 login: async (req, res)=>{
    try {
        const {email, password} = req.body;

        const user = await User.findOne({email})
        if(!user) return res.status(400).json({msg: "usaer does not exit"})

        const isMatch = await bcrypt.compare(password, user.password)
        if (!isMatch) return res.status(400).json({msg: "incorrect user name or password"})

        //if login success, create access token and refresh token
        const accesstoken = createAccessToken({id: user._id})
         const refreshtoken = createRefreshToken({id: user._id})
         
         res.cookie('refreshtoken', refreshtoken, {
             httpOnly :true,
             path:'/user/refresh_token',
             maxAge:7*24*60*1000 //7d
         })

       res.json({msg: "login successful"})

    } catch (error) {
        res.status(500).json({msg: error.message})
    }
 },
 logout: async (req, res)=>{
         try {
             res.clearCookie('refreshtoken', {path:"/user/refresh_token"})
             return res.json({msg: "log out successful"})
         } catch (error) {
            res.status(500).json({msg: error.message})  
         }
 },
 refreshToken: (req, res) =>{
    try {
        const rf_token = req.cookies.refreshtoken;
        // console.log(rf_token);
        if(!rf_token){
            res.status(400).json({msg: "please login or register"})
            console.log("not found")
        } 

        jwt.verify(rf_token, process.env.REFRESH_TOKEN, (err, user)=>{
            if(err) return res.status(400).json({msg: "please login or register"})
            console.log(err);
            const accesstoken = createAccessToken({id:user.id})
            res.json({user, accesstoken})
        })
   
        
        // res.json({rf_token})
    } catch (error) {
        res.status(500).json({msg: error.message})
    }
 },
 getuser: async (req, res)=>{
     try {
         const user = await User.findById(req.user.id).select('-password')
         if(!user) return res.status(400).json ({msg:"user does not exit"})
         res.json(user)

     } catch (error) {
        res.status(500).json({msg: error.message})
     }
 },
 addCart: async (req, res)=>{
     try {
         const user = await User.findById(req.user.id)
         
        console.log(req.user.id)

         if(!user) return res.status(400).json({msg: "User does not exit"})

       const newcart =  await User.findOneAndUpdate({_id: user},{
             cart: req.body.cart
         })
         return res.json({msg: ' added to cart'})

     } catch (error) {
        res.status(500).json({msg: error.messege}) 
     }
 },
 history: async (req, res) => {
    try {
        const history = await Payment.find({user_id: req.user.id})
        res.json(history)
    } catch (error) {
        res.status(500).json({msg: error.messege}) 
    }
 }
} 

const createAccessToken = (user) =>{
    return jwt.sign(user, process.env.ACCESS_TOKEN,{
        expiresIn: "11m"
    })
}
const createRefreshToken = (user) =>{
    return jwt.sign(user, process.env.REFRESH_TOKEN,{
        expiresIn: "7d"
    })
}

module.exports = userCtrl