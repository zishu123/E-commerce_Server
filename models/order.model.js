const mongoose = require('mongoose');
const {ObjectId} = mongoose.Schema;

const productCartSchema =new mongoose.Schema({
    product:{
        type:ObjectId,
        ref:"Product"
    },
    name:{
        type:String
    },
    count:{
        type:Number
    },
    price:{
        type:Number
    }
})
const productCart = mongoose.model("productCart",productCartSchema)
const OrderSchema = new mongoose.Schema({
    products:[productCartSchema],
    transaction_id:{},
    amount:{
        type:Number
    },
    address:{
        type:String
    },
    status:{
        type:String,
        default:"Recieved",
        enum:["Cancled","Delivered","shipped","processing","Recieved"]
    },
    updated:{
        type:Date
    },
    user:{
        type:ObjectId,
        ref:"User"
    }

},{timestamps:true})

const order = mongoose.model("Order",OrderSchema);
module.exports = {productCart,order}