const router = require("express").Router()

const paymentctrl = require('../controllers/paymentCtrl')

const auth = require("../middleware/auth")
const authAdmin = require("../middleware/authAdmin")


router.route('/payment')
    .get(auth,authAdmin, paymentctrl.getPayments)
    .post(auth, paymentctrl.createPayment)

    module.exports = router;
