const Products = require('../models/productModel')

//filter, sorting and pageinating 
class APIfeatures {
    constructor(query, queryString){
        this.query = query;
        this.queryString = queryString;
    }
    filtering(){
        const queryObj = {...this.queryString} //querystring = req.query
        // console.log({before: queryObj});
        const excludedfields = ['page', 'sort', 'limit']
        excludedfields.forEach(el => delete(queryObj[el]))
        let queryStr = JSON.stringify(queryObj)
        queryStr = queryStr.replace(/\b(gte|gt|lt|lte|regex)\b/g, match => '$' + match)
        // console.log({queryObj, queryStr})
        
        this.query.find(JSON.parse(queryStr))

        return this;
    }

    sorting(){
       if (this.queryString.sort) {
        const sortBy = this.queryString.sort.split(',').join(' ')
        this.query = this.query.sort(sortBy)
        
       } else {
           this.query = this.query.sort('-createdAt')
       }
       return this;
    }

    paginating(){
        const page = this.queryString.page * 1 || 1
        const limit = this.queryString.limit * 1 || 5
        const skip = (page - 1) * limit;
        this.query = this.query.skip(skip).limit(limit)
        return this;
    }
}

 const productCtrl ={
     getProduct: async (req, res)=>{
         try {
            const features = new APIfeatures( Products.find(), req.query)
            .filtering().sorting().paginating()
            const products = await features.query
            res.json({
                status:'success',
                result : products.length,
                products: products
            })
         } catch (error) {
            res.status(500).json({msg: error.message})
         }
     },
     createProduct: async (req, res)=>{
        try {
            const {product_id,tittle,price,description,content, images,category } = req.body;
            if(!images) return res.status(400).json({msg: "no img uploaded"})

            const product =await Products.findOne({product_id})
            if(product) 
            return res.status(400).json({msg: "this product is already exit"})

            const newProduct = new Products({
                product_id,
                tittle : tittle.toLowerCase(),
                price,
                description,
                content,
                 images,
                 category
            })
            await newProduct.save()
            res.json({msg : "created products"});
        } catch (error) {
           res.status(500).json({msg: error.message})
        }
    },
    deleteProduct: async (req, res)=>{
        try {
            console.log(req.params.id);
            await Products.findByIdAndDelete({_id:req.params.id})
            res.json({msg: "deleted a products sucessfull"})
        } catch (error) {
           res.status(500).json({msg: error.message})
        }
    },
    updateProduct: async (req, res)=>{
        try {
         const {tittle,price,description,content, images,category } = req.body;
         if(!images) return res.status(400).json({msg: "no img upload"})

         await Products.findOneAndUpdate({_id: req.params.id}, {
            tittle : tittle.toLowerCase(),
            price,
            description,
            content,
             images,
             category
         })
         res.json({msg: " updated a products"})
        } catch (error) {
           res.status(500).json({msg: error.message})
        }
    }
 }



module.exports = productCtrl