import { useEffect, useState } from "react";
import axios from "axios";

const AdminRides = () => {

    const [rides, setRides] = useState([]);

    const [passengers, setPassengers] = useState([]);

    const [showModal, setShowModal] = useState(false);


    useEffect(() => {

        fetchRides();

    }, []);



    const fetchRides = async () => {

        try {

            const res = await axios.get(
                "http://localhost:4000/rides"
            );

            setRides(res.data.rides);

        }

        catch(error){

            console.log(error);

        }

    };




    // =========================
    // VIEW PASSENGERS
    // =========================

    const viewPassengers = async (rideId)=>{

        try{

            const res = await axios.get(
                `http://localhost:4000/admin/ride-passengers/${rideId}`
            );


            setPassengers(res.data.passengers);

            setShowModal(true);


        }

        catch(error){

            console.log(error);

        }

    };





    const cancelRide = async (rideId) => {


        if (!window.confirm("Cancel this ride?"))
            return;


        try {


            const res = await axios.put(

                `http://localhost:4000/admin/cancel-ride/${rideId}`

            );


            alert(res.data.message);


            fetchRides();


        }

        catch(error){


            alert(
                error.response?.data?.message
            );


        }


    };






    const forceComplete = async (rideId)=>{


        if(!window.confirm("Force complete this ride?"))
            return;



        try{


            const res = await axios.put(

                `http://localhost:4000/admin/force-complete/${rideId}`

            );


            alert(res.data.message);


            fetchRides();


        }


        catch(error){


            alert(
                error.response?.data?.message
            );


        }


    };






    return (

        <div>


            <h1>
                Ride Management
            </h1>




            {
                rides.length===0

                ?

                <h3>
                    No Rides Found
                </h3>


                :


                rides.map((ride)=>(


                <div

                key={ride._id}

                style={{
                    border:"1px solid #ccc",
                    marginBottom:"20px",
                    padding:"15px"
                }}

                >



                <h3>

                {ride.source}

                →

                {ride.destination}

                </h3>




                <p>

                Driver :

                {
                    ride.driverId?.Name ||
                    ride.driverId?.name ||
                    "N/A"
                }

                </p>



                <p>

                Driver Phone :

                {
                    ride.driverId?.phone ||
                    "-"
                }

                </p>





                <p>

                Date :

                {
                    ride.departureDateTime

                    ?

                    new Date(
                        ride.departureDateTime
                    )
                    .toLocaleDateString("en-IN")


                    :


                    new Date(
                        ride.date
                    )
                    .toLocaleDateString("en-IN")
                }

                </p>





                <p>

                Departure :

                {
                    ride.departureDateTime

                    ?

                    new Date(
                        ride.departureDateTime
                    )
                    .toLocaleTimeString(
                        "en-IN",
                        {
                            hour:"2-digit",
                            minute:"2-digit",
                            hour12:true
                        }
                    )

                    :

                    ride.departureTime
                }


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





                <button

                onClick={()=>viewPassengers(ride._id)}

                >

                View Passengers

                </button>




                {" "}



                {

                ride.status!=="Cancelled"

                &&

                ride.status!=="Completed"

                &&

                (

                <button

                onClick={()=>
                    cancelRide(ride._id)
                }

                >

                Cancel Ride

                </button>

                )

                }





                {" "}



                {


                ride.status==="Ongoing"

                &&

                (

                <button

                onClick={()=>
                    forceComplete(ride._id)
                }

                >

                Force Complete

                </button>

                )


                }





                </div>


                ))

            }





            {/* =====================
                PASSENGER MODAL
            ===================== */}



            {

            showModal &&


            (

            <div

            style={{
                position:"fixed",
                top:0,
                left:0,
                width:"100%",
                height:"100%",
                background:"rgba(0,0,0,0.5)",
                display:"flex",
                justifyContent:"center",
                alignItems:"center"
            }}

            >



            <div

            style={{
                background:"white",
                padding:"20px",
                borderRadius:"10px",
                width:"400px"
            }}

            >



            <h2>
                Passenger Details
            </h2>





            {

            passengers.length===0

            ?

            (

            <p>
                No passengers found
            </p>

            )


            :


            passengers.map((p)=>(


            <div

            key={p.bookingId}

            >


            <p>

            Name :

            {p.name}

            </p>



            <p>

            Phone :

            {p.phone}

            </p>



            <p>

            Seats :

            {p.seatsBooked}

            </p>



            <p>

            Status :

            {p.bookingStatus}

            </p>



            <hr/>


            </div>


            ))

            }





            <button

            onClick={()=>{

                setShowModal(false);

                setPassengers([]);

            }}

            >

            Close

            </button>



            </div>



            </div>


            )


            }


        </div>

    );

};


export default AdminRides;