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

    driverAmount:{
        type:Number,
        default:0
    },

    platformFee:{
        type:Number,
        default:0
    },

    releasedAt:{
        type:Date,
        default:null
    },

    status:{
        type:String,
        enum:[
            "Held",
            "Released",
            "Refunded",
            "PendingAdmin",
            "Cancelled"
        ],
        default:"Held"
    },

paymentHistory: [
    {
        status: {
            type: String
        },

        changedBy: {
            type: String,
            default: "System"
        },

        remarks: {
            type: String,
            default: ""
        },

        changedAt: {
            type: Date,
            default: Date.now
        }
    }
]
},
{
    timestamps:true
});

module.exports = mongoose.model("Payment", paymentSchema);