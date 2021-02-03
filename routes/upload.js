const router = require("express").Router()
const cloudinary = require("cloudinary")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")
const fs = require("fs")
// const fileupload = require('express-fileupload')

// router.use(fileupload())

//we will upload img on clodinary 

cloudinary.config({
    cloud_name : process.env.CLOUD_NAME,
    api_key : process.env.CLOUD_API_KEY,
    api_secret : process.env.CLOUD_API_SECRET
})

//upload img only admin can do this 

router.post("/upload",auth, authAdmin, (req, res)=>{
    try {
        console.log(req.files)
        if(!req.files || Object.keys(req.files).length === 0 ) 
        return res.status(400).send('nofiles were uploaded')

        const file = req.files.file;
        console.log( `file size ${file}`);
        if(file.size > 1024*1024*5) {
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: " Size too large"})

        }
        if(file.mimetype !== "image/jpeg" && file.mimetype !== "image/png" ){
            removeTmp(file.tempFilePath)
            return res.status(400).json({msg: "File is incorrect"})
        }
      
        cloudinary.v2.uploader.upload(file.tempFilePath, {
            folder:"test"
        }, async(error, result) =>{
            if(error) throw error;
            removeTmp(file.tempFilePath)
            res.status(200).json({public_id: result.public_id, url : result.secure_url})
        })
        // res.send("test upload")
    } catch (error) {
        res.status(500).json({msg: error.message})
        console.log(error);
    }
})


//delete img and video 
router.post('/destroy', auth, authAdmin, (req, res)=>{
   try {
    const {public_id} = req.body;
    if(!public_id) return res.status(400).json({msg: " add public id"})

    cloudinary.v2.uploader.destroy(public_id, async(error, result)=>{
        if(error)  throw error;

        res.json({msg: "deleted img"})
    })

   } catch (error) {
    res.status(500).json({msg: error.message})
   }
})


const removeTmp = (path) =>{

    fs.unlink(path, error=>{
        if(error) throw error
    })
}

module.exports = router