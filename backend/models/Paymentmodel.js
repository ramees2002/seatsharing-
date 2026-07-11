const mongoose = require("mongoose");

const paymentSchema = new mongoose.Schema({

    bookingId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Booking",
        required:true
    },

    passengerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    amount:{
        type:Number,
        required:true
    },

    commission:{
        type:Number,
        default:0
    },

    driverAmount:{
        type:Number,
        default:0
    },

    status:{
        type:String,
        enum:[
            "Pending",
            "Paid",
            "Refunded",
            "Held",
            "Released"
        ],
        default:"Pending"
    }

},
{
    timestamps:true
});

module.exports = mongoose.model("Payment",paymentSchema);