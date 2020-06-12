const express = require("express");
const router = express.Router();

const {getCategoryById, createCategory, getAllCategory, getCategory, updateCategories, removeCategory}= require("../controllers/category");
const {isSignedIn, isAdmin, isAuthenticated} = require("../controllers/auth");
const {getUserById} = require("../controllers/user")

router.param("userId",getUserById);
router.param("categoryId", getCategoryById);

//actual route 
//create route
router.post("/category/create/:userId", isSignedIn, isAdmin, isAuthenticated,createCategory)

//read
router.get("/category/:categoryId", getCategory)
router.get("/categories", getAllCategory)

//update
router.put("/category/:categoryId/:userId", isSignedIn, isAdmin, isAuthenticated,updateCategories)

//delete
router.delete("/category/:categoryId/:userId", isSignedIn, isAdmin, isAuthenticated,removeCategory)


module.exports = router; 