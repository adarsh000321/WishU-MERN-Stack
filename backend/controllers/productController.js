import Products from "../models/Product.js"
import expressAsyncHandler from "express-async-handler"

export const getProducts = expressAsyncHandler(async (req, res, next) => {
    const products = await Products.find({})
    res.json(products)
})

export const getProductById = expressAsyncHandler(async (req, res, next) => {
    const product = await Products.findById(req.params.id)
    
    if(product){
        res.json(product)
    }else{
        res.status(404)
        throw new Error("Product not found")
    }
})