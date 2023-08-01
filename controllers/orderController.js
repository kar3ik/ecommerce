const Order = require('../models/orderModels')
const asyncErrorHandler  = require('../middleware/asyncError')
const ErrorHandler = require('../utils/errorHandler')
const Product =require('../models/productModel')


const newOrder = asyncErrorHandler(async(req,res,next)=>{
    const {shippingInfo,orderItems,paymentInfo, itemsPrice,taxPrice,shippingPrice,totalPrice} = req.body
    const order = await Order.create({
        shippingInfo,orderItems,paymentInfo, itemsPrice,taxPrice,shippingPrice,totalPrice,
        paidAt:Date.now(),user:req.user._id
    })
    res.status(200).json({success:true,order})
})





// single order
const singleOrder = asyncErrorHandler(async(req,res,next)=>{
    const order = await Order.findById(req.params.id).populate("user","name email")
    if(!order){
        return next(new ErrorHandler('order not found with this id',404))

    }
    res.status(200).json({
        success:true,
        order
    })

})



// login user orders
const myOrders = asyncErrorHandler(async(req,res,next)=>{
    const orders = await Order.find({user:req.user._id})
    res.status(200).json({
        success:true,
        orders
    })

})

// get all user orders
const allOrders = asyncErrorHandler(async(req,res,next)=>{
    const orders = await Order.find()

    let totalAmount = 0
    orders.forEach(order=>{
        totalAmount+=order.totalPrice
    })
    res.status(200).json({
        success:true,
        totalAmount,
        orders
    })

})

// update order status
const updateOrder = asyncErrorHandler(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler('order not found with this id',404))

    }
    if(order.orderStatus == 'Delivered'){
        return next(new ErrorHandler("PRODUCT DELIVERED",404))
    }
    order.orderItems.forEach(async(o)=>{
        await updateStock(o.product, o.quantity)           // o=>order
    })
    order.orderStatus = req.body.status
    if(req.body.status ==="Delivered"){
        order.deliveredAt=Date.now()
    }

    await order.save({validateBeforeSave : false})

    res.status(200).json({
        success:true,
    })

})

async function updateStock(id,quantity){
    const product = await Product.findById(id)
    product.Stock = product.stock - quantity
    await product.save({validateBeforeSave:false})


}

// delete order
const deleteOrder = asyncErrorHandler(async(req,res,next)=>{
    const order = await Order.findById(req.params.id)
    if(!order){
        return next(new ErrorHandler('order not found with this id',404))

    }

    await order.remove()
    res.status(200).json({
        success:true,
    })

})

module.exports ={ newOrder, singleOrder, myOrders, allOrders, updateOrder, deleteOrder}