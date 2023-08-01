const mongoose = require('mongoose');

// Define the product schema
const productSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  price: {
    type: Number,
    required: true,
  },
  description: {
    type: String,
    required: true
  },
  ratings:{
    type:Number,
    default:0,

  },
  images:[
    {
    public_id:{
        type:String,
        require: true

    } ,
    url: {
      type:String,
    require: true
    }
    }
  ],
  category: {
    type: String,
    require: [true,"please enter"]
  },
  Stock: {
    type: Number,
    require:true,
    default: 1,
    
  },
  numofReviews:{
    type:Number,
    default:0
  },
  reviews:[
    {
        user:{
          type:mongoose.Schema.ObjectId,
          ref:"User",
          req:true
        },
        name:{
            type:String,
            require:true
        },
        rating:{
            type:Number,
            require:true
        },
        comment:{
            type:String,
            require:true

        }
    }
  ],
  user:{
    type:mongoose.Schema.ObjectId,
    ref:"User",
    require:true

  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

// Create a Product model using the schema
const Product = mongoose.model('Product', productSchema);

// Export the Product model
module.exports = Product;
