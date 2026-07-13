const express = require("express");
const Booking = require("../models/Bookingmodel");
const Payment = require("../models/Paymentmodel");
const generateOTP=require("../utils/generateOTP");
const Ride = require("../models/Ridemodel");
const {
    releaseRidePayments
} = require("../services/paymentService");

const router = express.Router();


// ======================
// CREATE BOOKING
// ======================

// ======================
// CREATE BOOKING (FINAL SAFE VERSION)
// ======================

router.post("/create", async (req, res) => {
    try {

        const { rideId, passengerId, seatsBooked } = req.body;

        console.log(req.body);

        // ✅ VALIDATION 1
        if (!rideId) {
            return res.status(400).json({ message: "rideId missing" });
        }

        if (!passengerId) {
            return res.status(400).json({ message: "passengerId missing" });
        }

        if (!seatsBooked) {
            return res.status(400).json({ message: "seatsBooked missing" });
        }

        // ✅ EXTRA SAFETY CHECK (ADD THIS)
        if (seatsBooked <= 0) {
            return res.status(400).json({ message: "Invalid seats" });
        }

        // ✅ FIND RIDE
        const ride = await Ride.findById(rideId);

        if (!ride) {
            return res.status(404).json({
                message: "Ride not found"
            });
        }



if (ride.driverId.toString() === passengerId) {

    return res.status(400).json({

        message: "You cannot book your own ride"

    });

}


const existingBooking = await Booking.findOne({

    rideId,

    passengerId,

    bookingStatus: {

        $ne: "Cancelled"

    }

});

if (existingBooking) {

    return res.status(400).json({

        message: "You already booked this ride"

    });

}


        const now = new Date();

const rideStart = new Date(ride.date);

const [hours, minutes] = ride.departureTime.split(":");

rideStart.setHours(Number(hours));
rideStart.setMinutes(Number(minutes));
rideStart.setSeconds(0);
rideStart.setMilliseconds(0);

if (now >= rideStart) {

    return res.status(400).json({

        message: "Ride has already departed"

    });

}



// ✅ RIDE STATUS CHECK

if (
    ride.status === "Completed" ||
    ride.status === "Cancelled"
) {
    return res.status(400).json({
        message: "Ride unavailable"
    });
}


        // ✅ SEAT CHECK (IMPORTANT)
        if (ride.availableSeats < seatsBooked) {
            return res.status(400).json({
                message: "Seats not available"
            });
        }

        // ✅ UPDATE RIDE SEATS
        ride.availableSeats -= seatsBooked;

        if (ride.availableSeats === 0) {
            ride.status = "Scheduled";
        }

        await ride.save();

        // ✅ CREATE BOOKING
      const booking = new Booking({
    rideId,
    passengerId,
    seatsBooked,

    pickupOtp: generateOTP(),
    pickupOtpCreatedAt: new Date(),

    dropOtp: "",
    dropOtpCreatedAt: null
});
        await booking.save();

        return res.status(201).json({
    message: "Booking Success",
    booking,
    pickupOtp: booking.pickupOtp,
    dropOtp: booking.dropOtp
});

    } catch (error) {
        return res.status(500).json({
            message: "Booking Failed",
            error: error.message
        });
    }
});

// ======================
// MY BOOKINGS
// ======================

router.get("/my-bookings/:id", async (req, res) => {

    try {

        const bookings = await Booking.find({

            passengerId: req.params.id

        })

        .populate("rideId")

        .populate("passengerId");

        res.status(200).json({

            message: "Bookings Found",

            bookings

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// ======================
// SINGLE BOOKING
// ======================

router.get("/:id", async (req, res) => {

    try {

        const booking = await Booking.findById(

            req.params.id

        )

        .populate("rideId")

        .populate("passengerId");

        if (!booking) {

            return res.status(404).json({

                message: "Booking Not Found"

            });

        }

        res.status(200).json({

            booking

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// ======================
// CANCEL BOOKING
// ======================

router.put("/cancel/:id", async (req, res) => {

    try {

  const booking = await Booking.findById(
    req.params.id
);

if (!booking) {

    return res.status(404).json({

        message: "Booking Not Found"

    });

}

if (booking.bookingStatus === "Cancelled") {

    return res.status(400).json({

        message: "Booking already cancelled"

    });

}

        const ride = await Ride.findById(

            booking.rideId

        );

        if (!ride) {

    return res.status(404).json({

        message: "Ride Not Found"

    });

}

if (

    ride.status === "Ongoing" ||

    ride.status === "Completed"

) {

    return res.status(400).json({

        message: "Cannot cancel after trip starts"

    });

}

      
ride.availableSeats += booking.seatsBooked;

if (ride.availableSeats > ride.totalSeats) {

    ride.availableSeats = ride.totalSeats;

}

if (ride.status === "Full") {

    ride.status = "Scheduled";

}

await ride.save();


        booking.bookingStatus = "Cancelled";

        await booking.save();

  const payment = await Payment.findOne({
    bookingId: booking._id
});

if (payment && payment.status === "Held") {

    payment.status = "Refunded";

    payment.paymentHistory.push({
        status: "Refunded",
        changedBy: "Passenger",
        remarks: "Passenger cancelled before ride started",
        changedAt: new Date()
    });

    await payment.save();
}

        res.status(200).json({

            message: "Booking Cancelled",

            booking

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


// ======================
// DELETE BOOKING
// ======================

router.delete("/:id", async (req, res) => {

    try {

        const booking = await Booking.findByIdAndDelete(

            req.params.id

        );

        if (!booking) {

            return res.status(404).json({

                message: "Booking Not Found"

            });

        }

        res.status(200).json({

            message: "Booking Deleted"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


router.put("/driver-absent/:bookingId", async(req,res)=>{

try{

const booking = await Booking.findById(req.params.bookingId);

if(!booking){

return res.status(404).json({
message:"Booking not found"
});

}


if(
booking.bookingStatus==="Cancelled" ||
booking.bookingStatus==="Completed"
){

return res.status(400).json({
message:"Cannot report this booking"
});

}


// only this passenger booking gets affected

booking.disputeRaised = true;

booking.disputeType = "DriverAbsent";

booking.reportedBy = "Passenger";

booking.disputeStatus = "Pending";


booking.reportReason =
req.body.reportReason || "Driver did not arrive";


booking.reportDescription =
req.body.reportDescription || "";


booking.activityTimeline.push({

action:"Driver Absent Reported",

by:"Passenger",

message:"Passenger reported driver absent"

});


await booking.save();


res.status(200).json({

message:"Driver absence reported successfully",

booking

});


}

catch(error){

res.status(500).json({

message:error.message

});

}

});



router.put("/noshow/:id", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);
const {
    reportReason,
    reportDescription,
    waitTime,
    contactAttempted
} = req.body;

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        if (
            booking.bookingStatus === "Cancelled" ||
            booking.bookingStatus === "Completed"
        ) {

            return res.status(400).json({
                message: "Invalid booking"
            });

        }

        const ride = await Ride.findById(booking.rideId);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        // Prevent duplicate reports
        if (booking.disputeRaised) {

            return res.status(400).json({
                message: "Passenger has already been reported."
            });

        }

        // Convert to dispute instead of immediate NoShow
        booking.disputeRaised = true;

        booking.disputeType = "PassengerAbsent";

        booking.reportedBy = "Driver";

        booking.disputeStatus = "Pending";

        booking.bookingStatus = "DisputePending";


        booking.reportReason = reportReason;
booking.reportDescription = reportDescription;
booking.waitTime = waitTime;
booking.contactAttempted = contactAttempted;

        // Remove OTPs so this passenger will not block ride completion
        booking.pickupOtp = "";

        booking.dropOtp = "";

        booking.pickupOtpVerified = false;

        booking.dropOtpVerified = false;

        booking.activityTimeline.push({

            action: "Passenger Absent Reported",

            by: "Driver",

            message: "Driver reported that passenger did not arrive at the pickup location."

        });

        await booking.save();

        res.status(200).json({

            message: "Passenger absence reported successfully.",

            booking

        });

    }

catch (error) {

    console.log("NOSHOW ERROR:", error);

    res.status(500).json({

        message: error.message

    });

}

});




router.put("/raise-dispute/:id", async(req,res)=>{

try{

const booking = await Booking.findById(

req.params.id

);

if(!booking){

return res.status(404).json({

message:"Booking not found"

});

}

booking.disputeRaised=true;

booking.disputeStatus="Pending";

booking.disputeReason=req.body.reason;

await booking.save();

res.status(200).json({

message:"Dispute raised"

});

}

catch(error){

res.status(500).json({

message:error.message

});

}

});




router.put("/resolve-dispute/:id",async(req,res)=>{

try{

const booking = await Booking.findById(

req.params.id

);

if(!booking){

return res.status(404).json({

message:"Booking not found"

});

}

booking.disputeStatus="Resolved";

await booking.save();

res.status(200).json({

message:"Resolved"

});

}

catch(error){

res.status(500).json({

message:error.message

});

}

});



router.put("/verify-pickup/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId);

        if (booking.bookingStatus === "NoShow") {

    return res.status(400).json({

        message:"Passenger removed from ride"

    });

}

        const ride = await Ride.findById(booking.rideId);

if (ride.status !== "Ongoing") {
    return res.status(400).json({
        message: "Ride has not started yet"
    });
}

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.pickupOtpVerified) {
            return res.status(400).json({
                message: "Pickup OTP already verified"
            });
        }

        const otp = req.body.otp.toString();

        if (booking.pickupOtp !== otp) {
            return res.status(400).json({
                message: "Invalid Pickup OTP"
            });
        }

        booking.pickupOtpVerified = true;
        booking.pickupOtp = "";
        booking.bookingStatus = "Ongoing";

       
booking.dropOtp = generateOTP();
booking.dropOtpCreatedAt = new Date();

await booking.save();

const pendingPickup = await Booking.find({
    rideId: booking.rideId,
    pickupOtpVerified: false,
    bookingStatus: { $ne: "Cancelled" }
});

if (pendingPickup.length === 0) {

    const ride = await Ride.findById(booking.rideId);

    ride.status = "Ongoing";

    await ride.save();
}

res.status(200).json({
    message: "Pickup verified successfully",
    booking
});

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




router.put("/verify-drop/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId);

        if (booking.bookingStatus === "NoShow") {

    return res.status(400).json({

        message:"Passenger removed from ride"

    });

}

        const ride = await Ride.findById(booking.rideId);

if (ride.status !== "Ongoing") {
    return res.status(400).json({
        message: "Ride is not ongoing"
    });
}

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (!booking.pickupOtpVerified) {
            return res.status(400).json({
                message: "Pickup OTP not verified yet"
            });
        }

        if (booking.dropOtpVerified) {
            return res.status(400).json({
                message: "Drop OTP already verified"
            });
        }

        const otp = req.body.otp.toString();

        if (booking.dropOtp !== otp) {
            return res.status(400).json({
                message: "Invalid Drop OTP"
            });
        }

        booking.dropOtpVerified = true;
        booking.dropOtp = "";
        booking.bookingStatus = "Completed";

        await booking.save();

// ==============================
// RELEASE THIS PASSENGER PAYMENT
// ==============================

const payment = await Payment.findOne({
    bookingId: booking._id
});

if (
    payment &&
    payment.status === "Held" &&
    !booking.disputeRaised
) {

    payment.status = "Released";
    payment.releasedAt = new Date();

    payment.paymentHistory.push({
        status: "Released",
        message: "Passenger completed ride",
        changedAt: new Date()
    });

    await payment.save();
}



        const pendingDrop = await Booking.find({

    rideId: booking.rideId,

    $or: [

        // Passenger has not started the ride yet
        {
            bookingStatus: "Confirmed",
            disputeRaised: false
        },

        // Passenger is on the ride but has not verified drop OTP
        {
            bookingStatus: "Ongoing",
            dropOtpVerified: false,
            disputeRaised: false
        },

        // Driver reported passenger absent but passenger DISAGREED
        // This passenger is still considered active until admin decides.
        {
            disputeRaised: true,
            disputeType: "PassengerAbsent",
            disputeStatus: "Pending",
            passengerDecision: "Disagree"
        }

    ]

});


if (pendingDrop.length === 0) {

    const ride = await Ride.findById(booking.rideId);

    ride.status = "Completed";

    await ride.save();

 await releaseRidePayments(ride._id);
}
        // Check if every passenger has completed
 
        res.status(200).json({

            message: "Drop verified successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});




router.put("/report-absence/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        if (booking.disputeRaised) {

    return res.status(400).json({

        message: "A report has already been submitted for this booking."

    });

}


        const {

            disputeType,
            reportedBy,
            reportReason,
            reportDescription,
            waitTime,
            contactAttempted,
            evidence

        } = req.body;

        booking.disputeType = disputeType;
        booking.reportedBy = reportedBy;

        booking.reportReason = reportReason;
        booking.reportDescription = reportDescription;

        booking.waitTime = waitTime;
        booking.contactAttempted = contactAttempted;
        booking.evidence = evidence || "";

 booking.disputeRaised = true;

booking.disputeStatus = "Pending";

if (disputeType === "PassengerAbsent") {

    booking.bookingStatus = "DisputePending";

}

        booking.activityTimeline.push({

            action: "Report Submitted",

            by: reportedBy,

            message:
                `${reportedBy} reported ${disputeType}. Reason: ${reportReason}`

        });

        await booking.save();



        res.status(200).json({

            message: "Absence report submitted",

            booking

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


router.put("/absence-response/:bookingId", async (req, res) => {
    try {
        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {
            return res.status(404).json({
                message: "Booking not found"
            });
        }

        const {
            respondedBy,
            decision,
            reason,
            message,
            evidence
        } = req.body;

        // Driver response
        if (respondedBy === "Driver") {
            booking.driverDecision = decision;
            booking.driverReason = reason;
            booking.driverMessage = message;
            booking.driverEvidence = evidence || "";
        }
        // Passenger response
        else if (respondedBy === "Passenger") {
            booking.passengerDecision = decision;
            booking.passengerReason = reason;
            booking.passengerMessage = message;
            booking.passengerEvidence = evidence || "";
        }

        booking.activityTimeline.push({
            action: "Response Submitted",
            by: respondedBy,
            message: `${respondedBy} selected ${decision}`
        });

        // ======================
        // AUTO RESOLUTION
        // ======================

      

        // Passenger accepts Driver's PassengerAbsent report
        if (
            booking.disputeType === "PassengerAbsent" &&
            booking.passengerDecision === "Agree"
        ) {
            booking.disputeStatus = "Resolved";
            booking.resolvedBy = "System";
            booking.resolvedAt = new Date();

            booking.activityTimeline.push({
                action: "Resolved",
                by: "System",
                message: "Passenger admitted absence."
            });
        }

        // ======================
        // REMOVE ABSENT USER FROM RIDE
        // ======================

        if (
            booking.disputeStatus === "Resolved"
            &&
            booking.disputeType === "PassengerAbsent"
        ) {
            booking.bookingStatus = "NoShow";
        }

        // Driver accepts Passenger's DriverAbsent report
      if (
    booking.disputeType === "DriverAbsent" &&
    booking.driverDecision === "Agree"
) {
    booking.bookingStatus = "Cancelled";
    booking.disputeStatus = "Resolved";
    booking.resolvedBy = "System";
    booking.resolvedAt = new Date();

    booking.activityTimeline.push({
        action: "Resolved",
        by: "System",
        message: "Driver admitted absence."
    });
}

        await booking.save();

        const payment = await Payment.findOne({
            bookingId: booking._id
        });

        // Release payment if passenger admitted absence
        if (
            payment &&
            payment.status === "Held" &&
            booking.disputeType === "PassengerAbsent" &&
            booking.passengerDecision === "Agree"
        ) {
            payment.status = "Released";
            payment.releasedAt = new Date();

            payment.paymentHistory.push({
                status: "Released",
                changedBy: "System",
                remarks: "Passenger admitted no-show",
                changedAt: new Date()
            });

            await payment.save();
        }

        // [FIXED]: Refund payment if driver admitted absence
        if (
            payment &&
            payment.status === "Held" &&
            booking.disputeType === "DriverAbsent" &&
            booking.driverDecision === "Agree"
        ) {
            payment.status = "Refunded";

            payment.paymentHistory.push({
                status: "Refunded",
                changedBy: "System",
                remarks: "Driver admitted absence",
                changedAt: new Date()
            });

            await payment.save();
        }

        // Admin Escrow Logic for conflicting responses
        if (
            payment &&
            payment.status === "Held"
        ) {
            // Passenger says driver was absent, driver denies it
            if (
                booking.disputeType === "DriverAbsent" &&
                booking.driverDecision === "Disagree"
            ) {
                payment.status = "PendingAdmin";

                payment.paymentHistory.push({
                    status: "PendingAdmin",
                    changedBy: "System",
                    remarks: "Driver denied absence. Waiting for admin decision.",
                    changedAt: new Date()
                });

                await payment.save();
            }
            // Driver says passenger was absent, passenger denies it
            else if (
                booking.disputeType === "PassengerAbsent" &&
                booking.passengerDecision === "Disagree"
            ) {
                payment.status = "PendingAdmin";

                payment.paymentHistory.push({
                    status: "PendingAdmin",
                    changedBy: "System",
                    remarks: "Passenger denied absence. Waiting for admin decision.",
                    changedAt: new Date()
                });

                await payment.save();
            }
        }

        res.status(200).json({
            message: "Response saved",
            booking
        });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});



router.get("/my-reports/:userId", async (req, res) => {

    try {

       const reports = await Booking.find({

    disputeRaised: true

})

.populate({

    path: "rideId",

    populate: {

        path: "driverId"

    }

})

.populate("passengerId");

        const filteredReports = reports.filter(report => {

            const isPassenger =

                report.passengerId?._id.toString() === req.params.userId;

            const isDriver =

                report.rideId?.driverId?._id?.toString() === req.params.userId;

            return isPassenger || isDriver;

        });

        res.status(200).json({

            message: "Reports found",

            reports: filteredReports

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



router.get("/report/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId)

        .populate({

            path: "rideId",

            populate: {

                path: "driverId"

            }

        })

        .populate("passengerId");

        if (!booking) {

            return res.status(404).json({

                message: "Report not found"

            });

        }

        res.status(200).json({

            report: booking

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



router.get("/all-reports", async (req, res) => {

    try {

        const reports = await Booking.find({

            disputeRaised: true

        })

        .populate({

            path: "rideId",

            populate: {

                path: "driverId"

            }

        })

        .populate("passengerId")

        .sort({

            createdAt: -1

        });

        res.status(200).json({

            totalReports: reports.length,

            reports

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


router.put("/admin-resolve/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }

        const {

            decision,
            adminRemarks

        } = req.body;

        const ride = await Ride.findById(booking.rideId);

        if (!ride) {

            return res.status(404).json({

                message: "Ride not found"

            });

        }

        // ==========================
        // PASSENGER REPORT ACCEPTED
        // ==========================

        if (decision === "PassengerWins") {

            booking.disputeStatus = "Resolved";

            booking.resolvedBy = "Admin";

            booking.resolvedAt = new Date();

            booking.bookingStatus = "Cancelled";

            await Payment.updateMany(

                {

                    bookingId: booking._id,

                    status: "Held"

                },

                {

                    status: "Refunded"

                }

            );

        }

        // ==========================
        // DRIVER REPORT ACCEPTED
        // ==========================

        else if (decision === "DriverWins") {

            booking.disputeStatus = "Resolved";

            booking.resolvedBy = "Admin";

            booking.resolvedAt = new Date();

            booking.bookingStatus = "NoShow";

            await Payment.updateMany(

                {

                    bookingId: booking._id,

                    status: "Held"

                },

                {

                    status: "Released"

                }

            );

        }

        // ==========================
        // FALSE REPORT
        // ==========================

        else if (decision === "RejectReport") {

            booking.disputeStatus = "Resolved";

            booking.resolvedBy = "Admin";

            booking.resolvedAt = new Date();

        }

        booking.activityTimeline.push({

            action: "Admin Decision",

            by: "Admin",

            message: adminRemarks

        });

        await booking.save();

        res.status(200).json({

            message: "Report resolved successfully",

            booking

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



// ======================
// GET SINGLE REPORT
// ======================

router.get("/report/:id", async (req, res) => {

    try {

        const report = await Booking.findById(req.params.id)

            .populate({

                path: "rideId",

                populate: {

                    path: "driverId"

                }

            })

            .populate("passengerId");

        if (!report) {

            return res.status(404).json({

                message: "Report not found"

            });

        }

        return res.status(200).json({

            message: "Report fetched successfully",

            report

        });

    }

    catch (error) {

        return res.status(500).json({

            message: error.message

        });

    }

});

module.exports = router;