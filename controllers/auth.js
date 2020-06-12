var User =require("../models/user.model");
const {check,validationResult} =require("express-validator");
const jwt =require("jsonwebtoken");
const express_jwt =require("express-jwt");

exports.signUp =(req,res)=>{
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
    const user = new User(req.body)
    user.save((err,user)=>{
        if(err){
            return  res.status(400).json({err:"Not able to Save data in DB"})
        }
        res.json({
            name:user.name,
            email:user.email,
            id:user._id
        });
    })
    
}

exports.signIn=(req,res)=>{
    const {email,password} = req.body;
    const errors =validationResult(req);
    if(!errors.isEmpty()){
        return res.status(422).json({
            error:errors.array()[0].msg
        })
    }
    User.findOne({email},(err,user)=>{
        if(err || !user){
            return res.status(400).json({error:"User email does not exist"})
        }
        if(!user.authenticate(password)){
            return res.status(401).json({error:"email and password do not match"})
        }
        // create token
        const token =jwt.sign({_id:user._id},process.env.SECRET);
        //putt token in cookie
        res.cookie("token",token,{expire:new Date()+9999});
        
        //send response to front end
        
        const {_id,name,email,role}=user;
        return res.json({token:token,user:{_id,name,email,role}})
    })
}
                        
exports.signOut =(req,res)=>{
    res.clearCookie("token");
    res.json({
        message:"User signout successfully"
    })
}

//protected routes
exports.isSignedIn=express_jwt({
    secret:process.env.SECRET,
    userProperty:"auth",

})

//customs middle ware 
exports.isAuthenticated = (req,res,next)=>{
let checker = req.profile && req.auth && req.profile._id == req.auth._id;
if(!checker){
    return res.status(403).json({
        error:"Access Denied"
    })
}
next();
}

exports.isAdmin = (req,res,next)=>{
    if(req.profile.role === 0 ){
        return res.status(403).json({
            message:"You are not admin, Access Denied"
        })
    }
    next();
}