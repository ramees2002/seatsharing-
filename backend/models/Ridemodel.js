const mongoose = require("mongoose");

const rideSchema = new mongoose.Schema({

    driverId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    source:{
        type:String,
        required:true
    },

    destination:{
        type:String,
        required:true
    },

    date:{
        type:Date,
        required:true
    },

    departureTime:{
        type:String,
        required:true
    },

departureDateTime:{

type:Date,

required:true

},

    totalSeats:{
        type:Number,
        required:true,
        min:1
    },

    availableSeats:{
        type:Number,
        required:true,
        min:0
    },

    pricePerSeat:{
        type:Number,
        required:true,
        min:1
    },

    carName:{
        type:String,
        required:true
    },
    
startOtp:{
    type:String
},

startOtpCreatedAt:{
    type:Date
},

startOtpVerified:{
    type:Boolean,
    default:false
},

endOtp:{
    type:String
},

endOtpCreatedAt:{
    type:Date
},

endOtpVerified:{
    type:Boolean,
    default:false
},

otpAttempts:{
    type:Number,
    default:0
},
status:{
    type:String,

    enum:[
        "Scheduled",
        "Ongoing",
        "Full",
        "Completed",
        "Cancelled",
        "NoDriver"
    ],

    default:"Scheduled"
},



},
{
    timestamps:true
});

module.exports = mongoose.model("Ride",rideSchema);