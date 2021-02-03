const Category = require("../models/categoryModel")
const Products = require("../models/productModel")





const categoryCtrl = {
    getCategoris: async(req, res)=>{
        try {
          
            const categories =await Category.find()
            res.json(categories)

        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },
    createCategory: async(req, res)=>{
        try {
            //if user role = 1 -----> admin
            //only admin can create and deleteand update  category
            const {name} = req.body;
            const category =await Category.findOne({name})
            if(category) return res.status(400).json({msg: " is already exit"})


            const newCatgory = new Category({name})

            await newCatgory.save()

            res.json({msg:'create a new category'})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },
    deleteCategory: async(req, res)=>{
        try {
            const products = await Products.findOne({category: req.params.id})
            if(products)res.status(400).json({msg: "frist delete products then category"})
            await Category.findByIdAndDelete(req.params.id)
            res.json({msg: " deleted successfully"})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    },
    updateCategory: async (req,res)=>{
        try {
            const {name} = req.body;
            await Category.findOneAndUpdate({_id: req.params.id}, {name})
            res.json({msg: "Updated a category"})
        } catch (error) {
            res.status(500).json({msg: error.message})
        }
    }

}

module.exports = categoryCtrl