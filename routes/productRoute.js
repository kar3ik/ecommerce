const express = require('express')
const {getAllProducts, createProduct, updateProduct, deleteProduct, 
    getProductDetails, createProductReview, getProductReviews, deleteReview} = require('../controllers/productController')
const {isAuthenticatedUser,authorizeRoles} = require('../middleware/auth')
const router = express.Router()

router.route('/products').get(getAllProducts)
router.route('/admin/products/new').post(isAuthenticatedUser,authorizeRoles("admin"),createProduct)
router.route("/admin/product/:id").put(isAuthenticatedUser,authorizeRoles("admin"),updateProduct)
router.route("/admin/product/:id").delete(isAuthenticatedUser,authorizeRoles("admin"), deleteProduct)
router.route("/product/:id").get(getProductDetails)
router.route("/review").put(isAuthenticatedUser,createProductReview)
router.route("/reviews").get(isAuthenticatedUser,getProductReviews)
router.route("/review").delete(isAuthenticatedUser,deleteReview)



 
module.exports = router