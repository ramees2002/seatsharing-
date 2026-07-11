const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema({

reviewerId:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},

targetUserId:{

type:mongoose.Schema.Types.ObjectId,

ref:"User",

required:true

},

rideId:{

type:mongoose.Schema.Types.ObjectId,

ref:"Ride",

required:true

},

rating:{

type:Number,

required:true,

min:1,

max:5

},

comment:{

type:String,

trim:true,

maxlength:500,

default:""

}


},

{

timestamps:true

}

);

module.exports = mongoose.model(

"Review",

reviewSchema

);