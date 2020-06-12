var express =require('express');
var router  =express.Router();
const {check,validationResult} =require("express-validator")
const {signOut,signUp,signIn,isSignedIn} =require("../controllers/auth");
router.get("/signout",signOut);

router.post("/signup",[
    check("name").isLength({min:3}).withMessage("Name should be atleast 3 character"),
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min:3}).withMessage("Password should be atleast 3 char")
],signUp);

router.post("/signin",[
    check("email").isEmail().withMessage("Email is required"),
    check("password").isLength({min:3}).withMessage("Password is required").isLength({min:2})
],signIn);

router.get("/testroute",isSignedIn,(req,res)=>{
    res.json(req.auth)
})
module.exports =router;