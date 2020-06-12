const {productCart,order} = require("../models/order.model");

exports.getOrderById = (req,res,next,id)=>{
    order.findById(id).populate("products.product","name price").exec((err,order)=>{
        if(err){
            return res.status(400).json({
                message:"No order found in db"
            })
        }
        req.order = order
        next();
    })
}

exports.createOrder = (req,res)=>{
    req.body.order.user = req.profile;
    const order = new order(req.body.order);
    order.save((err,order)=>{
        if(err){
            return res.status(400).json({
                message:"Failed to save a order in db"
            })
        }
        res.json(order)
    })
}

exports.getAllOrders = (req,res) =>{
    order.find().populate("user","_id name").exec((err,order)=>{
        if(err){
            return res.status(400).json({
                message:"No order found"
            })
        }
        res.json(order);
    })
}
exports.getOrderStatus = (req,res)=>{
    res.json(order.schema.path("status").enumValues)

}
exports.updateStatus = (req,res)=>{
order.update({_id:req.body.orderId},{$set:{status:req.body.status}},(err,order)=>{
    if(err){
        return res.status(400).json({
            message:"Cannot update the status"
        })
    }
    res.json(order)
})
}