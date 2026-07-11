const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema({

    rideId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"Ride",
        required:true
    },

    passengerId:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },

    seatsBooked:{
        type:Number,
        required:true,
        min:1
    },




    bookingStatus:{

        type:String,

        enum:[
            "Confirmed",
            "Cancelled",
            "Completed",
            "Ongoing",
            "NoShow",
            "DisputePending"
        ],

        default:"Confirmed"
    },

    disputeRaised:{
type:Boolean,
default:false
},

disputeReason:{
type:String,
default:""
},

disputeStatus:{
type:String,

enum:[
"None",
"Pending",
"Resolved"
],

default:"None"
},
pickupOtp: {
    type: String,
    default: ""
},

pickupOtpCreatedAt: {
    type: Date
},

pickupOtpVerified: {
    type: Boolean,
    default: false
},

dropOtp: {
    type: String,
    default: ""
},

dropOtpCreatedAt: {
    type: Date
},

dropOtpVerified: {
    type: Boolean,
    default: false
},

absenceReportedBy: {
    type: String,
    enum: [
        "None",
        "Driver",
        "Passenger"
    ],
    default: "None"
},

absenceReason: {
    type: String,
    default: ""
},

absenceDescription: {
    type: String,
    default: ""
},

absenceDecision: {
    type: String,
    enum: [
        "Pending",
        "Agree",
        "Disagree"
    ],
    default: "Pending"
},

absenceResponded: {
    type: Boolean,
    default: false
},

// ======================
// ADVANCED ABSENCE REPORT SYSTEM
// ======================

disputeType:{
    type:String,
    enum:[
        "",
        "DriverAbsent",
        "PassengerAbsent"
    ],
    default:""
},

reportedBy:{
    type:String,
    enum:[
        "",
        "Passenger",
        "Driver"
    ],
    default:""
},

reportReason:{
    type:String,
    default:""
},

reportDescription:{
    type:String,
    default:""
},

waitTime:{
    type:String,
    default:""
},

contactAttempted:{
    type:Boolean,
    default:false
},

evidence:{
    type:String,
    default:""
},

// Driver response
driverDecision:{
    type:String,
    enum:[
        "",
        "Agree",
        "Disagree"
    ],
    default:""
},

driverReason:{
    type:String,
    default:""
},

driverMessage:{
    type:String,
    default:""
},

driverEvidence:{
    type:String,
    default:""
},

// Passenger response
passengerDecision:{
    type:String,
    enum:[
        "",
        "Agree",
        "Disagree"
    ],
    default:""
},

passengerReason:{
    type:String,
    default:""
},

passengerMessage:{
    type:String,
    default:""
},

passengerEvidence:{
    type:String,
    default:""
},

// Final decision
resolvedBy:{
    type:String,
    enum:[
        "",
        "System",
        "Admin"
    ],
    default:""
},

resolvedAt:{
    type:Date
},

activityTimeline:[
{
    action:String,
    by:String,
    message:String,
    time:{
        type:Date,
        default:Date.now
    }
}
],

    bookingDate:{
        type:Date,
        default:Date.now
    },

},
{
    timestamps:true
});

module.exports = mongoose.model("Booking",bookingSchema);