const User =require("../models/user.model");
const Order = require("../models/order.model")

exports.getUserById=(req,res,next,id)=>{
    User.findById(id).exec((err,user)=>{
        if(err || !user){
            return res.status(400).json({
                error:"no user found in db"
            })
        }
        req.profile = user;
        next();
    });
}

exports.getUser = (req,res)=>{
    //TODO get back here for password
    req.profile.salt = undefined;
    req.profile.enc_password = undefined;
    req.profile.createdAt = undefined;
    req.profile.updatedAt = undefined;
    return res.json(req.profile)
}

exports.updateUser = (req,res) =>{
    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$set:req.body},
        {new:true,useFindAndModify:true},
        (err,user)=>{
            if(err){
                return res.status(400).json({
                    message:"You are not Authourised to update this user"
                })
            }
            user.salt = undefined;
            user.enc_password = undefined
            res.json(user)
        }
    )
}

exports.userPurchaseList = (req,res)=>{
    Order.find({user:req.profile._id})
    .populate("user","_id name")
    .exec((err,order)=>{
        if(err){
            return res.status(400).json({
                message:"No order in this Account"
            })
        }
        return res.json(order)
    })
}

exports.pushOrderInPurchaseList = (req,res,next)=>{

    let purchases = [];
    req.body.order.products.forEach(product=>{
        purchases.push({
            _id:product._id,
            name:product.name,
            description:product.description,
            category:product.category,
            quantity:product.quantity,
            amount:req.body.order.amount,
            transaction_id:req.body.order.transaction_id
        })
    })

    User.findByIdAndUpdate(
        {_id:req.profile._id},
        {$push:{purchases:purchases}},
        {new: true},
        (err,purchases) =>{
            if(err){
                return res.status(400).json({
                    message:"Unable to save purchase List"
                })
            }
            next()
        }
    )

}