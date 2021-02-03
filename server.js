require('dotenv').config()
const express = require("express");
const mongoose = require("mongoose");
const cors = require('cors');
const fileUpload = require("express-fileupload");
const cookieParser = require("cookie-parser")
const path = require('path')



const app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors())
app.use(fileUpload({
    useTempFiles: true
}))

//routes
const router = require("./routes/userRouter")
const api = require("./routes/categoryRouter")
const upload = require("./routes/upload")
const product = require("./routes/productRouter")
const payment = require("./routes/paymentRouter")

app.use("/user", router )
app.use("/api", api )
app.use("/api", upload)
app.use("/api", product)
app.use("/api", payment)

//connect to the mongo db 

const URI = process.env.MONGODB_URL

mongoose.connect (URI, {
    useCreateIndex:true,
    useFindAndModify:false,
    useUnifiedTopology:true,
    useNewUrlParser: true

}).then(()=>{
    console.log("conecttion successful");
}).catch((e) =>{
    console.log(e);
});
if(process.env.NODE_ENV === 'production'){
    app.use(express.static('client/build'))

    app.get('*', (req, res) =>{
        res.sendFile(path.resolve(__dirname, 'client', 'build', "index.html"))
    })  
}

//listening the port 
const PORT = process.env.PORT || 5000
app.listen(PORT, ()=>{
    console.log(`server running on port ${5000}`)
})