const express = require("express");
const router = express.Router();

const Booking = require("../models/Bookingmodel");
const Ride = require("../models/Ridemodel");
const Payment = require("../models/Paymentmodel");

const User = require("../models/Usermodel");




router.get("/users", async (req, res) => {

    try {

        const users = await User.find()

            .select("-password")

            .sort({
                createdAt: -1
            });

        res.status(200).json({
            users
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});
// =====================================
// GET ALL DISPUTE REPORTS
// =====================================

router.get("/reports", async (req, res) => {

    try {

        const reports = await Booking.find({

            disputeRaised: true

        })

        .populate("passengerId")

        .populate({

            path: "rideId",

            populate: {

                path: "driverId"

            }

        })

        .sort({

            updatedAt: -1

        });

        res.status(200).json({

            reports

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



// =====================================
// GET SINGLE REPORT
// =====================================

router.get("/reports/:id", async (req, res) => {

    try {

        const report = await Booking.findById(req.params.id)

        .populate("passengerId")

        .populate({

            path: "rideId",

            populate: {

                path: "driverId"

            }

        });

        if (!report) {

            return res.status(404).json({

                message: "Report not found"

            });

        }

        res.status(200).json({

            report

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



// =====================================
// APPROVE PASSENGER
// =====================================

router.put("/approve-passenger/:id", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }

        booking.disputeStatus = "Resolved";

        booking.resolvedBy = "Admin";

        booking.resolvedAt = new Date();

        booking.activityTimeline.push({

            action: "Resolved",

            by: "Admin",

            message: "Passenger claim approved"

        });

        await booking.save();

     const payment = await Payment.findOne({
    bookingId: booking._id
});

if (payment) {

    payment.status = "Refunded";

    payment.paymentHistory.push({
        status: "Refunded",
        changedBy: "Admin",
        remarks: "Passenger dispute approved",
        changedAt: new Date()
    });

    await payment.save();
}

        res.status(200).json({

            message: "Passenger approved successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});




// =====================================
// APPROVE DRIVER
// =====================================

router.put("/approve-driver/:id", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }

        booking.disputeStatus = "Resolved";

        booking.resolvedBy = "Admin";

        booking.resolvedAt = new Date();

        booking.activityTimeline.push({

            action: "Resolved",

            by: "Admin",

            message: "Driver claim approved"

        });

        await booking.save();

const payment = await Payment.findOne({
    bookingId: booking._id
});

if (payment) {

    payment.status = "Released";
    payment.releasedAt = new Date();

    payment.paymentHistory.push({
        status: "Released",
        changedBy: "Admin",
        remarks: "Driver dispute approved",
        changedAt: new Date()
    });

    await payment.save();
}
        res.status(200).json({

            message: "Driver approved successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});




// =====================================
// CLOSE REPORT
// =====================================

router.put("/close-report/:id", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.id);

        if (!booking) {

            return res.status(404).json({

                message: "Booking not found"

            });

        }

        booking.disputeStatus = "Resolved";

        booking.resolvedBy = "Admin";

        booking.resolvedAt = new Date();

        booking.activityTimeline.push({

            action: "Closed",

            by: "Admin",

            message: "Dispute closed"

        });

        await booking.save();

        res.status(200).json({

            message: "Report closed"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});




// =====================================
// ADMIN DASHBOARD STATS
// =====================================

router.get("/stats", async (req, res) => {

    try {

        const totalReports = await Booking.countDocuments({

            disputeRaised: true

        });

        const pendingReports = await Booking.countDocuments({

            disputeRaised: true,

            disputeStatus: "Pending"

        });

        const resolvedReports = await Booking.countDocuments({

            disputeStatus: "Resolved"

        });

        const totalRides = await Ride.countDocuments();

        res.status(200).json({

            totalReports,

            pendingReports,

            resolvedReports,

            totalRides

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



router.put("/payment/:paymentId", async (req, res) => {

    try {

        const { status, remarks } = req.body;

        if (!["Released", "Refunded"].includes(status)) {
            return res.status(400).json({
                message: "Invalid payment status"
            });
        }

        const payment = await Payment.findById(req.params.paymentId);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

if (
    payment.status === "Released" ||
    payment.status === "Refunded"
) {
    return res.status(400).json({
        message: "Payment has already been processed"
    });
}

        payment.status = status;

        if (status === "Released") {
            payment.releasedAt = new Date();
        }

        payment.paymentHistory.push({
            status,
            changedBy: "Admin",
            remarks: remarks || "Admin override",
            changedAt: new Date()
        });

        await payment.save();

        res.status(200).json({
            message: "Payment updated successfully",
            payment
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


router.put("/cancel-ride/:rideId", async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.rideId);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        const bookings = await Booking.find({
            rideId: ride._id
        });

        for (const booking of bookings) {

            const payment = await Payment.findOne({
                bookingId: booking._id
            });

            if (
                payment &&
                (
                    payment.status === "Held" ||
                    payment.status === "PendingAdmin"
                )
            ) {

                payment.status = "Refunded";

                payment.paymentHistory.push({

                    status: "Refunded",

                    changedBy: "Admin",

                    remarks: "Ride cancelled by Admin",

                    changedAt: new Date()

                });

                await payment.save();

            }

            booking.bookingStatus = "Cancelled";

            await booking.save();

        }

        ride.status = "Cancelled";

        await ride.save();

        res.status(200).json({

            message: "Ride cancelled successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


router.put("/force-complete/:rideId", async (req, res) => {

    try {

        const ride = await Ride.findById(req.params.rideId);

        if (!ride) {

            return res.status(404).json({
                message: "Ride not found"
            });

        }

        const bookings = await Booking.find({
            rideId: ride._id
        });

        for (const booking of bookings) {

            const payment = await Payment.findOne({
                bookingId: booking._id
            });

            if (!payment) continue;

            if(
booking.bookingStatus==="Completed" &&
(
payment.status==="Held" ||
payment.status==="PendingAdmin"
)
)
            
            {

                payment.status = "Released";
                payment.releasedAt = new Date();

                payment.paymentHistory.push({
                    status: "Released",
                    changedBy: "Admin",
                    remarks: "Ride force completed by Admin",
                    changedAt: new Date()
                });

                await payment.save();

            }

            else if (
                booking.disputeRaised &&
                booking.disputeStatus === "Pending" &&
                payment.status === "Held"
            ) {

                payment.status = "PendingAdmin";

                payment.paymentHistory.push({
                    status: "PendingAdmin",
                    changedBy: "Admin",
                    remarks: "Force completed - dispute pending",
                    changedAt: new Date()
                });

                await payment.save();

            }

            else if (
                booking.bookingStatus === "Cancelled" &&
                payment.status === "Held"
            ) {

                payment.status = "Refunded";

                payment.paymentHistory.push({
                    status: "Refunded",
                    changedBy: "Admin",
                    remarks: "Cancelled passenger refunded",
                    changedAt: new Date()
                });

                await payment.save();

            }

        }

        ride.status = "Completed";

        await ride.save();

        res.status(200).json({

            message: "Ride force completed successfully"

        });

    } catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


router.put("/confirm-noshow/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        booking.bookingStatus = "NoShow";
        booking.disputeStatus = "Resolved";
        booking.resolvedBy = "Admin";
        booking.resolvedAt = new Date();

        await booking.save();

        const payment = await Payment.findOne({
            bookingId: booking._id
        });

        if (
            payment &&
            (
                payment.status === "Held" ||
                payment.status === "PendingAdmin"
            )
        ) {

            payment.status = "Released";
            payment.releasedAt = new Date();

            payment.paymentHistory.push({
                status: "Released",
                changedBy: "Admin",
                remarks: "Passenger confirmed as NoShow",
                changedAt: new Date()
            });

            await payment.save();

        }

        res.status(200).json({
            message: "NoShow confirmed successfully"
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});



router.put("/confirm-driver-absent/:bookingId", async (req, res) => {

    try {

        const booking = await Booking.findById(req.params.bookingId);

        if (!booking) {

            return res.status(404).json({
                message: "Booking not found"
            });

        }

        booking.bookingStatus = "Cancelled";
        booking.disputeStatus = "Resolved";
        booking.resolvedBy = "Admin";
        booking.resolvedAt = new Date();

        await booking.save();

        const payment = await Payment.findOne({
            bookingId: booking._id
        });

        if (
            payment &&
            (
                payment.status === "Held" ||
                payment.status === "PendingAdmin"
            )
        ) {

            payment.status = "Refunded";

            payment.paymentHistory.push({

                status: "Refunded",

                changedBy: "Admin",

                remarks: "Driver confirmed absent",

                changedAt: new Date()

            });

            await payment.save();

        }

        res.status(200).json({

            message: "Driver absence confirmed successfully"

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});



router.get("/payments", async (req, res) => {

    try {

        const payments = await Payment.find()

            .populate("bookingId")
            .populate("passengerId")
            .populate("driverId")

            .sort({
                createdAt: -1
            });

        res.status(200).json({
            payments
        });

    } catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});




router.delete("/users/:id", async (req, res) => {

    try {

        const user = await User.findById(req.params.id);

        if (!user) {

            return res.status(404).json({
                message: "User not found"
            });

        }

        if (user.role === "admin") {

            return res.status(400).json({
                message: "Cannot delete admin account"
            });

        }

        await User.findByIdAndDelete(req.params.id);

        res.status(200).json({
            message: "User deleted successfully"
        });

    }

    catch (error) {

        res.status(500).json({
            message: error.message
        });

    }

});


// =====================================
// PLATFORM EARNINGS
// =====================================

router.get("/platform-earnings", async (req, res) => {

    try {

        const payments = await Payment.find()

            .populate("passengerId")

            .populate("driverId")

            .sort({
                createdAt: -1
            });

        let totalPlatformEarnings = 0;

        let releasedPlatformEarnings = 0;

        let heldPlatformEarnings = 0;

        let refundedPlatformFees = 0;

        payments.forEach(payment => {

            totalPlatformEarnings += payment.platformFee;

            if (payment.status === "Released") {

                releasedPlatformEarnings += payment.platformFee;

            }

            else if (

                payment.status === "Held" ||

                payment.status === "PendingAdmin"

            ) {

                heldPlatformEarnings += payment.platformFee;

            }

            else if (payment.status === "Refunded") {

                refundedPlatformFees += payment.platformFee;

            }

        });

        res.status(200).json({

            totalPlatformEarnings,

            releasedPlatformEarnings,

            heldPlatformEarnings,

            refundedPlatformFees,

            totalTransactions: payments.length,

            payments

        });

    }

    catch (error) {

        res.status(500).json({

            message: error.message

        });

    }

});


module.exports = router;