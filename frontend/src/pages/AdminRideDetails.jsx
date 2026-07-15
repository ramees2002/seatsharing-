import { useEffect, useState } from "react";
import { useParams } from "react-router";
import axios from "axios";

const AdminRideDetails = () => {

    const { rideId } = useParams();

    const [ride, setRide] = useState(null);

    const [bookings, setBookings] = useState([]);

    useEffect(() => {

        loadRide();

    }, []);

    const loadRide = async () => {

        try {

            const rideRes = await axios.get(

                `http://localhost:4000/rides/${rideId}`

            );

            setRide(rideRes.data.ride);

            const passengerRes = await axios.get(

                `http://localhost:4000/rides/passengers/${rideId}`

            );

            const paymentRes = await axios.get(

                "http://localhost:4000/admin/payments"

            );

            const merged = passengerRes.data.passengers.map(passenger => {

                const payment = paymentRes.data.payments.find(

                    payment =>

                        payment.bookingId?._id === passenger.bookingId ||

                        payment.bookingId === passenger.bookingId

                );

                return {

                    ...passenger,

                    payment

                };

            });

            setBookings(merged);

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!ride) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h1>Ride Details</h1>

            <hr />

            <h3>

                {ride.source}

                →

                {ride.destination}

            </h3>

            <p>

                Driver :

                {ride.driverId?.Name}

            </p>

            <p>

                Date :

                {ride.date}

            </p>

            <p>

                Departure :

                {ride.departureTime}

            </p>

            <p>

                Status :

                {ride.status}

            </p>

            <p>

                Seats :

                {ride.availableSeats}

                /

                {ride.totalSeats}

            </p>

            <p>

                Price :

                ₹{ride.pricePerSeat}

            </p>

            <hr />

            <h2>Passengers</h2>

            {

                bookings.length === 0

                ?

                <h3>No Passengers</h3>

                :

                bookings.map(passenger => (

                    <div

                        key={passenger.bookingId}

                        style={{

                            border: "1px solid gray",

                            padding: "15px",

                            marginBottom: "15px"

                        }}

                    >

                        <h3>

                            {passenger.userName}

                        </h3>

                        <p>

                            Seats :

                            {passenger.seatsBooked}

                        </p>

                        <p>

                            Booking Status :

                            {passenger.bookingStatus}

                        </p>

                        <p>

                            Pickup Verified :

                            {

                                passenger.pickupOtpVerified

                                ?

                                "Yes"

                                :

                                "No"

                            }

                        </p>

                        <p>

                            Drop Verified :

                            {

                                passenger.dropOtpVerified

                                ?

                                "Yes"

                                :

                                "No"

                            }

                        </p>

                        <p>

                            Dispute Raised :

                            {

                                passenger.disputeRaised

                                ?

                                "Yes"

                                :

                                "No"

                            }

                        </p>

                        {

                            passenger.disputeRaised &&

                            <>

                                <p>

                                    Type :

                                    {passenger.disputeType}

                                </p>

                                <p>

                                    Status :

                                    {passenger.disputeStatus}

                                </p>

                                <p>

                                    Reason :

                                    {passenger.reportReason}

                                </p>

                            </>

                        }

                        <hr />

                        <h4>Payment</h4>

                        {

                            passenger.payment

                            ?

                            <>

                                <p>

                                    Amount :

                                    ₹{passenger.payment.amount}

                                </p>

                                <p>

                                    Driver Share :

                                    ₹{passenger.payment.driverAmount}

                                </p>

                                <p>

                                    Platform Fee :

                                    ₹{passenger.payment.platformFee}

                                </p>

                                <p>

                                    Payment Status :

                                    {passenger.payment.status}

                                </p>

                            </>

                            :

                            <p>

                                No Payment Found

                            </p>

                        }

                    </div>

                ))

            }

        </div>

    );

};

export default AdminRideDetails;