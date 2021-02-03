const router = require("express").Router()
const categoryCtrl = require("../controllers/categoryCtrl")
const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")


router.route('/category')
.get(categoryCtrl.getCategoris)
.post( categoryCtrl.createCategory)

router.route('/category/:id')
.delete(auth, authAdmin, categoryCtrl.deleteCategory) 
.put(auth, authAdmin, categoryCtrl.updateCategory) 
module.exports = router