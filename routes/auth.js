const express = require("express");
const { check , validationResult } = require("express-validator");
const router = express.Router();
const { signout , signup , signin , isSignedIn } = require("../controllers/auth");

//signup routes
router.post("/signup" , [
    check("name" , "name should be at least 3 char").isLength({min : 3}),
    check("email" , "email is required").isEmail(),
    check("password" , "password should be at least 3 char").isLength({min : 3}),
] ,signup);


//signin routes
router.post("/signin" , [
    check("email" , "email is required").isEmail(),
    check("password" , "password field is required").isLength({min : 1}),
] ,signin);


//signout routes
router.get("/signout" , signout);

//testroute
router.get("/testroute" , isSignedIn , (req,res)=>{
    res.send(req.auth);
})


module.exports = router;