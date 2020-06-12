const Product = require("../models/product.model");
const formidble =  require("formidable");
const _ = require("lodash");
const fs = require("fs")

exports.getProductById=(req,res,next,id)=>{
    Product.findById(id)
    .populate("category")
    .exec((err,product)=>{
        if(err){
            return res.status(400).jsons({
                message:"Product Not found"
            })
        }
        req.product = product;
        next()
    })
}

exports.createProduct = (req,res)=>{
    let form =new formidble.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with imges"
            })
        }
        //destructure the fields
        const {name, description, price, category, stock} =fields;

        if(!name || !description|| !price || !category || !stock ) {
            return res.status(400).json({
                error:"Please includes all the fields"
            })
        }
        //restriction on field
        let product = new Product(fields);

        //handle file  here
        if(file.photo){
            if(file.photo.size> 3*1024*1024){
                return res.status(400).json({
                    error:"File is too big"
                })
             }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //save  to the db
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    message:"Saving t shirt to db is failed"
                })
            }
            res.json(product)
        })
        
    })
}
exports.getProduct = (req,res)=>{
    req.product.photo = undefined;
    return res.json(req.product)
}
exports.photos = (req,res,next) =>{
    if(req.product.photo.data){
        res.set("content-Type", req.product.photo.contentType);
        return res.send(req.product.photo.data);
    }
    next();
} 

exports.updateProduct = (req,res) =>{
    let form =new formidble.IncomingForm();
    form.keepExtensions=true;
    form.parse(req,(err,fields,file)=>{
        if(err){
            return res.status(400).json({
                error:"Problem with imges"
            })
        }
        
        //rupdation code
        let product = req.product
        product= _.extend(product,fields);
        //handle file  here
        if(file.photo){
            if(file.photo.size> 3*1024*1024){
                return res.status(400).json({
                    error:"File is too big"
                })
             }
            product.photo.data = fs.readFileSync(file.photo.path)
            product.photo.contentType = file.photo.type
        }
        //save  to the db
        product.save((err,product)=>{
            if(err){
                return res.status(400).json({
                    message:"Updation of product is failed"
                })
            }
            res.json(product)
        })
        
    })
}

exports.removeProduct= (req,res) =>{
    let product  = req.product;
    product.remove((err,deletedProduct)=>{
        if(err){
            return res.status(400).json({
                message:"Failed to delete product"
            })
        }
        res.json({
            message:"Product deleted Successfully",
            deletedProduct:deletedProduct
        })
    })
}

exports.getAllProducts=(req,res)=>{
    let limit = req.query.limit ? parseInt(req.query.limit) : 8
    let sortBy = req.query.sortBy ?req.query.sortBy :"_id"
    Product.find()
        .select("-photo")
        .populate("category")
        .sort([[sortBy,"asc"]])
        .limit(limit)
        .exec((err,products)=>{
            if(err){
                return res.status(400).json({
                    message:"No Product Found"
                })
            }
            res.json(products)
        })
}

exports.updateStock = (req,res,next) =>{
    let myOpreations = req.body.order.products.map(prod=>{
        return{
            updateOne:{
                filter:{_id:prod._id},
                update:{$inc:{stock: -prod.count,sold:+prod.count}}
            }
        }
    })

    Product.bulkWrite(myOpreations,{},(err,products)=>{
        if(err){
            return res.status(400).json({
                message:"Bulk Opreation failed"
            })
        }
        next();
    })
}
exports.getAllUniqueCategory=(req,res)=>{
    Product.distinct("category",{},(err,getCategory)=>{
        if(err){
            return res.status(400).json({
                message:"No category found"
            })
        }
        res.json(getCategory)
    })
}