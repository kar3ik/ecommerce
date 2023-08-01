const ErrorHandler = require('../utils/errorHandler')
const Product =require('../models/productModel')
const asyncErrorHandler  = require('../middleware/asyncError')
const ApiFeatures = require('../utils/apifeatures')



// Create product
const createProduct = asyncErrorHandler(async (req,res,next) =>{
    req.body.user = req.user.id
    const product = await Product.create(req.body)
    res.status(201).json({success : true , product })
}
)


// Get Allproduct
const getAllProducts = asyncErrorHandler(async(req,res)=>{
    const resultPerPage = 5;
    const productCount = await Product.countDocuments()

    const apifeature = new ApiFeatures(Product.find(),req.query).search()
    .filter()
    .pagination(resultPerPage)

    const products = await apifeature.query
    res.status(200).json({success : true , products})
})


//Update product
const updateProduct = asyncErrorHandler(async(req,res)=>{
    let product =await Product.findById(req.params.id);
    if(!product){
        return next(new ErrorHandler("product not found" , 404))
    }
    product = await product.findByIdAndUpdate(req.params.id,req.body,
        {new:true,runValidators:true,useFindAndModify:false})
        res.status(200).json({success:true,product})
})


// Delete
const deleteProduct = asyncErrorHandler(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found" , 404))
    }
    await product.remove();
    res.status(200).json({
        success:true,
        message:"product deleted successfully"
    })
})


// Get productDetails
const getProductDetails=asyncErrorHandler(async(req,res,next)=>{
    const product = await Product.findById(req.params.id)
    if(!product){
        return next(new ErrorHandler("product not found" , 404))
    }
    res.status(200).json({
        success:true,
        product,
        productCount
    })
})


const createProductReview = asyncErrorHandler(async(req,res,next)=>{

    const {rating,comment,productId} = req.body
    const review= {
        user:req.user._id,
        name:req.user.name,
        rating:Number(rating),
        comment
    }

    const product = await Product.findById(productId)
    const isReviewed = product.reviews.find(rev =>rev.user.toString()===req.user._id.toString())
    if(isReviewed){
        product.reviews.forEach(rev=>{
            if(rev.user.toString()===req.user._id.toString())
                rev.rating = rating,
                rev.comment= comment
        })


    }else{
        product.reviews.push(review)
        product.numofReviews=product.reviews.length

    }
    let avg=0
    product.reviews.forEach(rev=>{
        avg = avg+rev.rating
    }) 
    product.ratings = avg/product.reviews.length

    await product.save({validateBeforeSave:false})
    res.status(200).json({success:true})
})


const getProductReviews = asyncErrorHandler(async(req,res,next)=>{
    const product = await Product.findById(req.query.id)
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }

    res.status(200).json({success:true,
    reviews:product.reviews})

})


const deleteReview = asyncErrorHandler(async(req,res,next)=>{
    const product = await Product.findById(req.query.productId)
    if(!product){
        return next(new ErrorHandler("product not found",404))
    }
    const reviews = product.reviews.filter(rev=>rev._id.toString()!==req.query.id.toString())
    let avg=0
    reviews.forEach(rev=>{
        avg = avg+rev.rating
    }) 
    const ratings = avg/reviews.length
    const numofReviews = reviews.length
    await Product.findByIdAndUpdate(req.query.productId,{
        reviews,
        ratings,
        numofReviews
    },{new:true, runValidators:true, useFindAndModify:false})


    res.status(200).json({success:true,
    reviews:product.reviews})



})
module.exports =  {getAllProducts , createProduct, updateProduct,deleteProduct,getProductDetails, createProductReview,
                          getProductReviews, deleteReview }