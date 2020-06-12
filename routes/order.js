const express =require("express");
const router =express.Router();


const {isSignedIn,isAuthenticated,isAdmin} = require("../controllers/auth")
const {getUserById,pushOrderInPurchaseList} = require("../controllers/user")

const {updateStock} = require("../controllers/product")
const {getOrderById,createOrder,getAllOrders,updateStatus,getOrderStatus} = require("../controllers/order");

router.param("userId",getUserById)
router.param("orderId",getOrderById)

//create 
router.post( "/order/create/:userId",isAuthenticated,isSignedIn,pushOrderInPurchaseList,updateStock,createOrder);
//read
router.get("/order/all/:userId",isSignedIn,isAuthenticated,isAdmin,getAllOrders)

//status of  order
router.get("/order/status/:userId",isSignedIn,isAdmin,isAuthenticated,getOrderStatus)
router.get("/order/:orderId/status/:userId",isSignedIn,isAuthenticated,isAdmin,updateStatus)
module.exports=router