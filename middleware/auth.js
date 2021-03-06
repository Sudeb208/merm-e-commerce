const jwt =require("jsonwebtoken");

const auth = (req, res, next) =>{
    try {
        const token = req.header("Authorization")
        if(!token) return res.status(400).json({msg: "invalid Authorization"})

        jwt.verify(token, process.env.ACCESS_TOKEN, (err, user) =>{
            if(err) return res.status(400).json({msg: "invalid Authorization for token mating"})

            req.user = user
            next()
        })
    } catch (error) {
        res. status(500).json({msg:error.message})
    }

    
}

module.exports = auth