const Payment = require("../models/Paymentmodel");
const Booking = require("../models/Bookingmodel");

const releaseRidePayments = async (rideId) => {

    const bookings = await Booking.find({
        rideId
    });

    for (const booking of bookings) {

        const payment = await Payment.findOne({
            bookingId: booking._id
        });

        if (!payment) continue;

        // Never modify already processed payments
        if (
            payment.status === "Released" ||
            payment.status === "Refunded"
        ) {
            continue;
        }

        // =========================
        // Passenger completed ride
        // =========================
        if (
            booking.bookingStatus === "Completed" &&
            !booking.disputeRaised
        ) {

            payment.status = "Released";
            payment.releasedAt = new Date();

            payment.paymentHistory.push({
                status: "Released",
                changedBy: "System",
                remarks: "Ride completed successfully",
                changedAt: new Date()
            });

            await payment.save();
            continue;
        }

        // =========================
        // Passenger cancelled ride
        // =========================
        if (
            booking.bookingStatus === "Cancelled"
        ) {

            payment.status = "Refunded";

            payment.paymentHistory.push({
                status: "Refunded",
                changedBy: "System",
                remarks: "Passenger cancelled ride",
                changedAt: new Date()
            });

            await payment.save();
            continue;
        }

        // =========================
        // Any dispute
        // =========================
        if (
            booking.disputeRaised &&
            payment.status === "Held"
        ) {

            payment.status = "PendingAdmin";

            payment.paymentHistory.push({
                status: "PendingAdmin",
                changedBy: "System",
                remarks: "Waiting for admin decision",
                changedAt: new Date()
            });

            await payment.save();
            continue;
        }

    }

};

module.exports = {
    releaseRidePayments
};