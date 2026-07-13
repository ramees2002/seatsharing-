const express = require("express");
const Ride = require("../models/Ridemodel");
const Booking= require("../models/Bookingmodel");
const generateOTP=require("../utils/generateOTP");
const Payment=require("../models/Paymentmodel");
const router = express.Router();


// CREATE RIDE

router.post("/create", async (req, res) => {

    try {

        const {

            driverId,
            source,
            destination,
            date,
            departureTime,
            totalSeats,
            availableSeats,
            pricePerSeat,
            carName

        } = req.body;

const totalSeatsNum = Number(totalSeats);
const availableSeatsNum = Number(availableSeats);
const pricePerSeatNum = Number(pricePerSeat);        


        if (

            !driverId ||
            !source ||
            !destination ||
            !date ||
            !departureTime ||
            !totalSeats ||
            !availableSeats ||
            !pricePerSeat ||
            !carName

        ) {

            return res.status(400).json({

                message: "All fields are required"

            });

        }



if (totalSeatsNum <= 0) {

    return res.status(400).json({

        message:"Total seats must be greater than zero"

    });

}

if (availableSeatsNum < 0) {

    return res.status(400).json({

        message:"Available seats cannot be negative"

    });

}

if (availableSeatsNum > totalSeatsNum) {

    return res.status(400).json({

        message:"Available seats cannot exceed total seats"

    });

}

if (pricePerSeatNum <= 0) {

    return res.status(400).json({

        message:"Price must be greater than zero"

    });

}


        if (

source.trim().toLowerCase()

===

destination.trim().toLowerCase()

) {

return res.status(400).json({

message:

"Source and Destination cannot be same"

});

}


const today = new Date();

today.setHours(

0,

0,

0,

0

);

const selectedDate = new Date(date);

selectedDate.setHours(

0,

0,

0,

0

);

if (

selectedDate < today

) {

return res.status(400).json({

message:

"Past dates are not allowed"

});

}


const now = new Date();

const rideDateTime = new Date(date);

const [hours, minutes] = departureTime.split(":");

rideDateTime.setHours(hours);
rideDateTime.setMinutes(minutes);
rideDateTime.setSeconds(0);
rideDateTime.setMilliseconds(0);

if (rideDateTime < now) {

    return res.status(400).json({

        message: "Past time is not allowed"

    });

}


const departureDateTime = new Date(date);


departureDateTime.setHours(Number(hours));
departureDateTime.setMinutes(Number(minutes));
departureDateTime.setSeconds(0);
departureDateTime.setMilliseconds(0);


const existingRide = await Ride.findOne({

    driverId,

    source,

    destination,

    date,

    departureTime

});

if (existingRide) {

    return res.status(400).json({

        message: "You already created a ride for this route and time"

    });

}
const ride = new Ride({

    driverId,
    source,
    destination,
    date,
    departureTime,
    departureDateTime,
    totalSeats: totalSeatsNum,
    availableSeats: availableSeatsNum,
    pricePerSeat: pricePerSeatNum,
    carName

});


        await ride.save();


        res.status(201).json({

            message: "Ride Created Successfully",

            ride

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Ride Creation Failed",

            error: error.message

        });

    }

});




// GET ALL RIDES

router.get("/", async (req, res) => {

    try {

        const rides = await Ride.find()

            .populate("driverId");



        res.status(200).json({

            message: "Rides Found",

            rides

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Fetch Failed",

            error: error.message

        });

    }

});




// SEARCH RIDES

router.get("/search", async (req, res) => {

    try {



        const {

            source,

            destination,

            date

        } = req.query;


       const rides = await Ride.find({

    source,

    destination,

    date,

    status: {

        $in: [

            "Scheduled",

            "Ongoing"

        ]

    }

}).populate("driverId");


const now = new Date();

const filteredRides = rides.filter((ride) => {

const rideStart = new Date(ride.date);

const [hours, minutes] =
ride.departureTime.split(":");

rideStart.setHours(Number(hours));
rideStart.setMinutes(Number(minutes));
rideStart.setSeconds(0);
rideStart.setMilliseconds(0);

return rideStart > now;

});


        res.status(200).json({

            message: "Ride Found",

            rides:filteredRides

        });

    }

    catch (error) {

        res.status(500).json({

            message: "Search Failed",

            error: error.message

        });

    }

});




// MY RIDES

router.get("/my-rides/:id",

async (req, res) => {

try {




const rides = await Ride.find({

driverId: req.params.id

});


res.status(200).json({

message: "My Rides",

rides

});

}

catch (error) {

res.status(500).json({

message: "Error",

error: error.message

});

}

});





// SINGLE RIDE

router.get("/:id",

async (req, res) => {

try {

const ride = await Ride.findById(

req.params.id

).populate(

"driverId"

);


if (!ride) {

return res.status(404).json({

message: "Ride Not Found"

});

}


res.status(200).json({

ride

});

}

catch (error) {

res.status(500).json({

message: error.message

});

}

});





// UPDATE RIDE

router.put("/:id",

async (req, res) => {

try {

const ride = await Ride.findById(

req.params.id

);


if (!ride) {

return res.status(404).json({

message: "Ride Not Found"

});

}


Object.assign(

ride,

req.body

);


await ride.save();


res.status(200).json({

message: "Ride Updated",

ride

});

}

catch (error) {

res.status(500).json({

message: error.message

});

}

});





// DELETE RIDE

router.delete("/:id", async (req, res) => {
  return res.status(400).json({
    message: "Delete disabled. Use cancel instead."
  });
});


router.get("/passengers/:rideId", async (req, res) => {
  try {
    

const bookings = await Booking.find({

      rideId: req.params.rideId,

  
bookingStatus: {

    $nin: [

        "Cancelled",

        "NoShow"

    ]

}

}).populate("passengerId");


    if (!bookings || bookings.length === 0) {
      return res.status(200).json({
        passengers: [],
        message: "No passengers found",
      });
    }

const passengers = bookings.map((b) => ({

    bookingId: b._id,

    userName:
        b.passengerId?.Name ||
        b.passengerId?.name ||
        b.passengerId?.email ||
        "Unknown User",

    userId: b.passengerId?._id,

    seatsBooked: b.seatsBooked,

    bookingStatus: b.bookingStatus,

    pickupOtpVerified: b.pickupOtpVerified,

    dropOtpVerified: b.dropOtpVerified,

    disputeRaised: b.disputeRaised,

    disputeStatus: b.disputeStatus,

    disputeType: b.disputeType,

    reportedBy: b.reportedBy,

    reportReason: b.reportReason,

    reportDescription: b.reportDescription,

    driverDecision: b.driverDecision,

    driverReason: b.driverReason,

    driverMessage: b.driverMessage,

    passengerDecision: b.passengerDecision,

    passengerReason: b.passengerReason,

    passengerMessage: b.passengerMessage

}));

    return res.status(200).json({
      passengers,
      totalPassengers: passengers.length,
    });

  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch passengers",
      error: error.message,
    });
  }
});



router.put("/status/:id", async (req, res) => {

  try {

    const ride = await Ride.findById(req.params.id);

    if (!ride) {

      return res.status(404).json({

        message: "Ride not found"

      });

    }

    const newStatus = req.body.status;


if(

ride.status==="Ongoing"

&&

newStatus==="Scheduled"

){

return res.status(400).json({

message:"Ride cannot go back to Scheduled"

});

}

if (newStatus === "Ongoing") {

    if (
        ride.status !== "Scheduled" &&
        ride.status !== "Full"
    ) {

        return res.status(400).json({

            message: "Only Scheduled or Full rides can start"

        });

    }

    const rideStart = new Date(ride.date);

    const [h, m] = ride.departureTime.split(":");

    rideStart.setHours(Number(h));
    rideStart.setMinutes(Number(m));
    rideStart.setSeconds(0);
    rideStart.setMilliseconds(0);

    if (new Date() < rideStart) {

        return res.status(400).json({

            message: "Ride cannot start before departure time"

        });

    }


}
    // Generate OTP





if (newStatus === "Completed" && ride.status !== "Ongoing") {
    return res.status(400).json({
        message: "Only Ongoing rides can be Completed"
    });
}

    // Completed rides are locked
    if (ride.status === "Completed") {

      return res.status(400).json({

        message: "Completed rides cannot be modified"

      });

    }

    // Cancelled rides are locked
    if (ride.status === "Cancelled") {

      return res.status(400).json({

        message: "Cancelled rides cannot be modified"

      });

    }

    // Prevent future rides from being completed
  const now = new Date();


if (newStatus === "Completed") {

    if (ride.status !== "Ongoing") {

        return res.status(400).json({

            message: "Ride must be Ongoing before completing"

        });

    }


}

   
if (newStatus === "Ongoing") {

    ride.status = "Ongoing";

    await ride.save();

    return res.status(200).json({
        message: "Ride Started",
        ride
    });

}


if (newStatus === "Completed") {

    return res.status(400).json({
        message: "Ride completes automatically after all passengers verify Drop OTP."
    });

}







const Payment = require("../models/Paymentmodel");



    res.status(200).json({

      message: "Status updated",

      ride

    });

  }

  catch (error) {

    res.status(500).json({

      message: error.message

    });

  }

});


router.put("/cancel/:id", async (req, res) => {
  try {

    const ride = await Ride.findById(req.params.id);

    if (!ride) {
      return res.status(404).json({
        message: "Ride not found"
      });
    }

    if (ride.status !== "Scheduled") {
      return res.status(400).json({
        message: "Only Scheduled rides can be cancelled"
      });
    }

    ride.status = "Cancelled";
    await ride.save();

    await Booking.updateMany(
      { rideId: ride._id },
      { bookingStatus: "Cancelled" }
    );

    // Find all bookings of this ride
    const bookings = await Booking.find({
      rideId: ride._id
    });

    const bookingIds = bookings.map(
      booking => booking._id
    );

    console.log("Booking IDs:", bookingIds);

  const payments = await Payment.find({
    bookingId: {
        $in: bookingIds
    },
    status: "Held"
});

for (const payment of payments) {

    payment.status = "Refunded";

    payment.paymentHistory.push({
        status: "Refunded",
        changedBy: "Driver",
        remarks: "Ride cancelled by driver",
        changedAt: new Date()
    });

    await payment.save();
}

    return res.status(200).json({
      message: "Ride cancelled successfully"
    });

  } catch (error) {

    return res.status(500).json({
      message: error.message
    });

  }
});



// ======================
// VERIFY RIDE OTP
// ======================







// GET START OTP FOR PASSENGER




module.exports = router;