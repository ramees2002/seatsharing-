import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const MyBookings = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();


    const [bookings, setBookings] = useState([]);

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [rating, setRating] = useState(0);

    const [comment, setComment] = useState("");



    useEffect(() => {

        fetchBookings();


        const interval = setInterval(() => {

            fetchBookings();

        },3000);


        return () => clearInterval(interval);


    }, []);



    const fetchBookings = async () => {

        try {

            const res = await axios.get(

                `http://localhost:4000/bookings/my-bookings/${user._id}`

            );


            setBookings(res.data.bookings);


        } catch(error){

            console.log(error);

        }

    };



    const cancelBooking = async(id)=>{

        try{


            await axios.put(

                `http://localhost:4000/bookings/cancel/${id}`

            );


            fetchBookings();


        }

        catch(error){

            console.log(error);

        }

    };



    const openReviewModal = (booking)=>{

        setSelectedBooking(booking);

    };



    const submitReview = async()=>{


        try{


            const payload={

                reviewerId:user._id,

                targetUserId:selectedBooking.rideId.driverId,

                rideId:selectedBooking.rideId._id,

                rating,

                comment

            };


            await axios.post(

                "http://localhost:4000/reviews/create",

                payload

            );


            alert("Review submitted");


            setSelectedBooking(null);

            setRating(0);

            setComment("");


            fetchBookings();


        }

        catch(error){

            console.log(error.response?.data?.message);

        }


    };




    return (

        <div className="mybookings">


            <h1>
                My Bookings
            </h1>



            {
            bookings.length === 0

            ?

            (

            <p>
                No Bookings Found
            </p>

            )

            :

            (

            bookings.map((booking)=>(


            <div

            className="booking-card"

            key={booking._id}

            >



            <h3>

            {
            booking.rideId?.source || "Ride Deleted"
            }

            →

            {
            booking.rideId?.destination || "-"
            }

            </h3>



            <p>

            <b>Date :</b>

            {" "}

            {
            booking.rideId?.date
            ?
            booking.rideId.date.substring(0,10)
            :
            "-"
            }

            </p>



            <p>

            <b>Seats :</b>

            {" "}

            {booking.seatsBooked}

            </p>



            <p>

            <b>Status :</b>

            {" "}

            {booking.bookingStatus}

            </p>

{
(() => {

if (!booking.rideId) return false;

const startTime = new Date(booking.rideId.date);

const [h, m] = booking.rideId.departureTime.split(":");

startTime.setHours(Number(h));
startTime.setMinutes(Number(m));
startTime.setSeconds(0);

const diff = startTime - new Date();

return (
diff <= 10 * 60 * 1000 &&
booking.bookingStatus !== "Cancelled" &&
booking.bookingStatus !== "Completed" &&
booking.bookingStatus !== "NoShow" &&
booking.rideId?.status !== "Completed" &&
booking.rideId?.status !== "Cancelled" &&
booking.rideId?.driverId?.phone
);

})()

&&

(

<p>

<b>Driver Phone :</b>

{booking.rideId.driverId.phone}

</p>

)
}

            {/* PICKUP OTP */}

            {
            booking.bookingStatus === "Confirmed"
            &&
            !booking.pickupOtpVerified
            &&
            (

            <div className="otp-box">

            <h4>
            Pickup OTP
            </h4>


            <h2>
            {booking.pickupOtp}
            </h2>


            <p>
            Show this OTP to the driver
            </p>


            </div>

            )
            }



            {/* DROP OTP */}

            {
            booking.bookingStatus === "Ongoing"
            &&
            !booking.dropOtpVerified
            &&
            booking.dropOtp
            &&
            (

            <div className="otp-box">


            <h4>
            Drop OTP
            </h4>


            <h2>
            {booking.dropOtp}
            </h2>


            <p>
            Show this OTP before reaching destination
            </p>


            </div>

            )
            }




            {
            booking.bookingStatus === "Confirmed"
            &&

            (

            <p>
            Waiting for driver to start ride
            </p>

            )
            }




            {
            booking.bookingStatus === "Ongoing"

            &&

            (

            <p>
            Ride Started
            </p>

            )

            }





            {/* CANCEL BOOKING */}


            {
            booking.bookingStatus !== "Cancelled"
            &&
            booking.rideId
            &&
            booking.rideId.status === "Scheduled"

            &&

            (

            <button

            onClick={()=>
            cancelBooking(booking._id)
            }

            >

            Cancel Booking

            </button>

            )

            }






            {/* DRIVER ABSENT BUTTON */}


            {
            booking.bookingStatus === "Confirmed"

            &&

            booking.rideId

            &&
            booking.rideId.status === "Scheduled"

            &&

            !booking.disputeRaised

            &&

            (

            <button

            onClick={()=>navigate(
            `/driver-absent/${booking._id}`
            )}

            >

            Driver Absent

            </button>

            )

            }







            {/* DRIVER REPORTED PASSENGER ABSENT */}

{
booking.disputeRaised &&
booking.reportedBy === "Driver" && (

<div className="report-box">

    <h3>🚨 Driver Reported Passenger Absent</h3>

    <p>
        <b>Status :</b>{" "}
        {booking.disputeStatus}
    </p>

    <p>
        <b>Reason :</b>{" "}
        {booking.reportReason || "-"}
    </p>

    <p>
        <b>Description :</b>{" "}
        {booking.reportDescription || "-"}
    </p>

    <p>
        <b>Wait Time :</b>{" "}
        {booking.waitTime
            ? `${booking.waitTime} Minutes`
            : "-"
        }
    </p>

    <p>
        <b>Contact Attempted :</b>{" "}
        {booking.contactAttempted ? "Yes" : "No"}
    </p>

    <hr />

    {
        !booking.passengerDecision ? (

            <button
                onClick={() =>
                    navigate(`/respond-report/${booking._id}`)
                }
            >
                Respond
            </button>

        ) : (

            <>

                <h4>Your Response</h4>

                <p>
                    <b>Decision :</b>{" "}
                    {booking.passengerDecision}
                </p>

                <p>
                    <b>Reason :</b>{" "}
                    {booking.passengerReason || "-"}
                </p>

                <p>
                    <b>Message :</b>{" "}
                    {booking.passengerMessage || "-"}
                </p>

            </>

        )
    }

    <br />

    <button
        onClick={() =>
            navigate(`/report/${booking._id}`)
        }
    >
        View Full Report
    </button>

</div>

)
}

            {/* PASSENGER REPORTED DRIVER ABSENT */}


            {
            booking.disputeRaised

            &&

            booking.reportedBy === "Passenger"

            &&

            (

            <div className="report-box">


            <h3>
            🚨 You Reported Driver Absent
            </h3>



            <p>

            <b>
            Status :
            </b>

            {" "}

            {booking.disputeStatus}

            </p>




            <p>

            <b>
            Reason :
            </b>

            {" "}

            {booking.reportReason || "-"}

            </p>




            <p>

            <b>
            Description :
            </b>

            {" "}

            {booking.reportDescription || "-"}

            </p>




            <p>

            <b>
            Driver Decision :
            </b>

            {" "}


            {
            booking.driverDecision

            ?

            booking.driverDecision

            :

            "Waiting for driver response"

            }


            </p>





            {
            booking.driverMessage

            &&

            (

            <p>

            <b>
            Driver Message :
            </b>

            {" "}

            {booking.driverMessage}

            </p>

            )

            }




            <button

            onClick={()=>navigate(
            `/report/${booking._id}`
            )}

            >

            View Details

            </button>



            </div>


            )

            }





            {/* REVIEW */}


            {
            booking.bookingStatus === "Completed"

            &&

            booking.rideId

            &&

            (

            <button

            onClick={()=>openReviewModal(booking)}

            >

            Leave Review

            </button>


            )

            }





            </div>


            ))

            )

            }




            {/* REVIEW MODAL */}



            {
            selectedBooking

            &&

            (

            <div className="modal-overlay">


            <div className="modal-box">


            <h3>
            Rate your ride
            </h3>



            <select

            value={rating}

            onChange={(e)=>
            setRating(Number(e.target.value))
            }

            >

            <option value="0">
            Select Rating
            </option>

            <option value="1">
            ⭐
            </option>

            <option value="2">
            ⭐⭐
            </option>

            <option value="3">
            ⭐⭐⭐
            </option>

            <option value="4">
            ⭐⭐⭐⭐
            </option>

            <option value="5">
            ⭐⭐⭐⭐⭐
            </option>


            </select>




            <br/><br/>




            <textarea

            rows="4"

            placeholder="Write review"

            value={comment}

            onChange={(e)=>
            setComment(e.target.value)
            }

            />




            <br/><br/>




            <button

            onClick={submitReview}

            >

            Submit

            </button>





            <button

            onClick={()=>
            setSelectedBooking(null)
            }

            >

            Cancel

            </button>




            </div>


            </div>

            )

            }




        </div>

    );

};


export default MyBookings;