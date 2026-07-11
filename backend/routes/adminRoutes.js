const express = require("express");
const router = express.Router();

const Booking = require("../models/Bookingmodel");
const Ride = require("../models/Ridemodel");
const Payment = require("../models/Paymentmodel");


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

        await Payment.updateMany(

            {

                bookingId: booking._id,

                status: "Held"

            },

            {

                status: "Refunded"

            }

        );

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

        await Payment.updateMany(

            {

                bookingId: booking._id,

                status: "Held"

            },

            {

                status: "Released"

            }

        );

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



module.exports = router;