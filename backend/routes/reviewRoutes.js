const express = require("express");
const router = express.Router();

const mongoose = require("mongoose");

const Review = require("../models/Reviewmodel");
const Booking = require("../models/Bookingmodel");
const Ride = require("../models/Ridemodel");
const User = require("../models/Usermodel");


/* ==========================
   CREATE REVIEW (BlaBlaCar STYLE)
========================== */

router.post("/create", async (req, res) => {
  try {
    const {
      reviewerId,
      targetUserId,
      rideId,
      rating,
      comment
    } = req.body;

    /* ==========================
       REQUIRED VALIDATION
    ========================== */

    if (!reviewerId || !targetUserId || !rideId || !rating) {
      return res.status(400).json({
        message: "Missing required fields"
      });
    }

    /* ==========================
       SELF REVIEW BLOCK
    ========================== */

    if (reviewerId === targetUserId) {
      return res.status(400).json({
        message: "You cannot review yourself"
      });
    }

    /* ==========================
       VALID RATING
    ========================== */

    if (rating < 1 || rating > 5) {
      return res.status(400).json({
        message: "Rating must be between 1 and 5"
      });
    }

    /* ==========================
       CHECK RIDE EXISTS
    ========================== */

    const ride = await Ride.findById(rideId);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found"
      });
    }

    /* ==========================
       ONLY COMPLETED RIDES
    ========================== */

    if (ride.status !== "Completed") {
      return res.status(400).json({
        message: "Ride must be completed before review"
      });
    }

    /* ==========================
       PREVENT DRIVER REVIEW SELF PASSENGER INVALID CASE
    ========================== */

    const isDriver = ride.driverId.toString() === reviewerId;

    const booking = await Booking.findOne({
      rideId,
      passengerId: reviewerId
    });

    const isPassenger = !!booking;

    if (!isDriver && !isPassenger) {
      return res.status(403).json({
        message: "You did not participate in this ride"
      });
    }

    /* ==========================
       TARGET VALIDATION
    ========================== */

    if (isPassenger) {
      // passenger reviewing driver
      if (targetUserId !== ride.driverId.toString()) {
        return res.status(400).json({
          message: "Passengers can only review driver"
        });
      }
    }

    if (isDriver) {
      // driver reviewing passenger
      const passengerBooking = await Booking.findOne({
        rideId,
        passengerId: targetUserId
      });

      if (!passengerBooking) {
        return res.status(400).json({
          message: "Invalid passenger for this ride"
        });
      }
    }

    /* ==========================
       DUPLICATE REVIEW CHECK (SAFE)
    ========================== */

    const existingReview = await Review.findOne({
      reviewerId,
      targetUserId,
      rideId
    });

    if (existingReview) {
      return res.status(400).json({
        message: "You already reviewed this user for this ride"
      });
    }

    /* ==========================
       CREATE REVIEW
    ========================== */

    const review = await Review.create({
      reviewerId,
      targetUserId,
      rideId,
      rating,
      comment: comment || ""
    });



/* ==========================
   UPDATE USER RATING
========================== */

const userReviews = await Review.find({

targetUserId

});

const totalReviews = userReviews.length;

const averageRating =

userReviews.reduce(

(sum, review) =>

sum + review.rating,

0

) / totalReviews;


await User.findByIdAndUpdate(

targetUserId,

{

rating: averageRating,

reviewCount: totalReviews

}

);


    return res.status(201).json({
      message: "Review submitted successfully",
      review
    });

  } catch (error) {
    return res.status(500).json({
      message: "Review creation failed",
      error: error.message
    });
  }
});


/* ==========================
   GET USER REVIEWS + STATS
========================== */

router.get("/:userId", async (req, res) => {
  try {
    const userId = new mongoose.Types.ObjectId(req.params.userId);

    const reviews = await Review.find({ targetUserId: userId })
      .populate("reviewerId", "Name")
      .sort({ createdAt: -1 });

    const stats = await Review.aggregate([
      { $match: { targetUserId: userId } },
      {
        $group: {
          _id: "$targetUserId",
          averageRating: { $avg: "$rating" },
          totalReviews: { $sum: 1 }
        }
      }
    ]);

    return res.status(200).json({
      reviews,
      averageRating: stats[0]?.averageRating || 0,
      totalReviews: stats[0]?.totalReviews || 0
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});


/* ==========================
   DELETE REVIEW (OPTIONAL ADMIN FEATURE)
========================== */

router.delete("/:reviewId", async (req, res) => {
  try {
    const review = await Review.findByIdAndDelete(req.params.reviewId);

    if (!review) {
      return res.status(404).json({
        message: "Review not found"
      });
    }

    return res.status(200).json({
      message: "Review deleted successfully"
    });

  } catch (error) {
    return res.status(500).json({
      message: error.message
    });
  }
});

module.exports = router;