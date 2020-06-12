const express =require("express");
const router =express.Router();

const {getProductById,createProduct,getProduct,photos,removeProduct,updateProduct,getAllProducts,getAllUniqueCategory} = require("../controllers/product")
const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById} = require("../controllers/user")

//all of params
router.param("userId",getUserById);
router.param("productId",getProductById)

//all of actual routes
router.post("/product/create/:userId", isSignedIn, isAdmin, isAuthenticated,createProduct)

router.get("/product/:prouctId",getProduct);
router.get("/product/photo/:productId",photos)

//delete route
router.delete("/product/:productId/:userId",isSignedIn, isAdmin, isAuthenticated,removeProduct)

//update 
router.put("/product/:productId/:userId",isSignedIn, isAdmin, isAuthenticated,updateProduct)

//lisiting product
router.get("/products",getAllProducts)
router.get("/products/categories",getAllUniqueCategory)
module.exports =router;