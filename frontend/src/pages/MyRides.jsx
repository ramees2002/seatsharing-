import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const MyRides = () => {

  const user = JSON.parse(localStorage.getItem("user"));
  const navigate=useNavigate();

  const [rides, setRides] = useState([]);

  const [activeTab, setActiveTab] = useState("active");

  const [passengers, setPassengers] = useState([]);

  const [showModal, setShowModal] = useState(false);

  // NEW OTP STATES

  const [selectedRide, setSelectedRide] = useState(null);

  const [pickupOtps, setPickupOtps] = useState({});

  const [dropOtps, setDropOtps] = useState({});


useEffect(() => {

fetchRides();

const interval = setInterval(() => {

fetchRides();

if(showModal && selectedRide){

viewPassengers(selectedRide);

}

},3000);

return ()=>clearInterval(interval);

},[showModal,selectedRide]);




  // ======================
  // FETCH DRIVER RIDES
  // ======================

  const fetchRides = async () => {

    try {

      const res = await axios.get(

        `http://localhost:4000/rides/my-rides/${user._id}`

      );

      setRides(res.data.rides);

    }

    catch (error) {

      console.log(error);

    }

  };




  // ======================
  // VIEW PASSENGERS
  // ======================

  const viewPassengers = async (rideId) => {

    try {

      const res = await axios.get(

        `http://localhost:4000/rides/passengers/${rideId}`

      );

      setPassengers(res.data.passengers);

      setSelectedRide(rideId);

      setShowModal(true);

    }

    catch (error) {

      console.log(error);

    }

  };




  // ======================
  // START RIDE
  // ======================

  const startRide = async (rideId) => {

    try {

      const res = await axios.put(

        `http://localhost:4000/rides/status/${rideId}`,

        {

          status: "Ongoing"

        }

      );

      alert(res.data.message);

      fetchRides();

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Failed to start ride"

      );

    }

  };




  // ======================
  // COMPLETE RIDE
  // ======================

  const completeRide = async (rideId) => {

    try {

      const res = await axios.put(

        `http://localhost:4000/rides/status/${rideId}`,

        {

          status: "Completed"

        }

      );

      alert(res.data.message);

      fetchRides();

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Failed to complete ride"

      );

    }

  };




  // ======================
  // VERIFY PICKUP OTP
  // ======================

  const verifyPickupOTP = async (bookingId) => {

    try {

      const res = await axios.put(

        `http://localhost:4000/bookings/verify-pickup/${bookingId}`,

        {

          otp: pickupOtps[bookingId]

        }

      );

      alert(res.data.message);

      setPickupOtps(prev => ({

        ...prev,

        [bookingId]: ""

      }));

      viewPassengers(selectedRide);

      fetchRides();

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Pickup OTP verification failed"

      );

    }

  };




  // ======================
  // VERIFY DROP OTP
  // ======================

  const verifyDropOTP = async (bookingId) => {

    try {

      const res = await axios.put(

        `http://localhost:4000/bookings/verify-drop/${bookingId}`,

        {

          otp: dropOtps[bookingId]

        }

      );

      alert(res.data.message);

      setDropOtps(prev => ({

        ...prev,

        [bookingId]: ""

      }));

      viewPassengers(selectedRide);

      fetchRides();

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Drop OTP verification failed"

      );

    }

  };

  // ======================
  // CANCEL RIDE
  // ======================

  const cancelRide = async (rideId) => {

    try {

      await axios.put(

        `http://localhost:4000/rides/cancel/${rideId}`

      );

      setRides(prev =>

        prev.map(r =>

          r._id === rideId

          ?

          {

            ...r,

            status: "Cancelled"

          }

          :

          r

        )

      );

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Cancel failed"

      );

    }

  };



  // ======================
  // FILTER RIDES
  // ======================

  const filteredRides =

    activeTab === "active"

      ?

      rides.filter(

        (r) =>

         r.status === "Scheduled"
||
r.status === "Full"
||
r.status === "Ongoing"

      )

      :

      rides.filter(

        (r) =>

          r.status === "Completed"

      );



  return (

    <div className="myrides">

      <h1>

        My Rides

      </h1>



      <div style={{ marginBottom: "20px" }}>

        <button

          onClick={() =>

            setActiveTab("active")

          }

        >

          Active Rides

        </button>



        <button

          onClick={() =>

            setActiveTab("completed")

          }

        >

          Completed Rides

        </button>

      </div>



      {

        rides.length === 0

          ?

          (

            <p>

              No Rides Available

            </p>

          )

          :

          (

            filteredRides.map((ride) => (

              <div

                className="ride-card"

                key={ride._id}

              >

                <h3>

                  {ride.source}

                  →

                  {ride.destination}

                </h3>



                <p>

                  Date :

                  {ride.date?.substring(0, 10)}

                </p>



                <p>

                  Departure :

                  {ride.departureTime}

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



                <p>

                  Car :

                  {ride.carName}

                </p>



                <p>

                  Status :

                  {ride.status}

                </p>



                <button

                  onClick={() =>

                    viewPassengers(ride._id)

                  }

                >

                  View Passengers

                </button>



                {

                  activeTab === "active"

                  &&

                  (

                    <>

                      {

                       (
ride.status === "Scheduled" ||
ride.status === "Full"
)

                        &&

                        (

                          <button

                            onClick={() =>

                              startRide(ride._id)

                            }

                          >

                            start ride

                          </button>

                        )

                      }





                      {

                        (
ride.status === "Scheduled" ||
ride.status === "Full"
)

                        &&

                        (

                          <button

                            onClick={() =>

                              cancelRide(ride._id)

                            }

                          >

                            Cancel Ride

                          </button>

                        )

                      }

                    </>

                  )

                }

              </div>

            ))

          )

      }

      {/* ======================
          PASSENGERS MODAL
      ====================== */}

      {

        showModal

        &&

        (

          <div className="modal">

            <div className="modal-content">

              <h2>

                Passengers

              </h2>

              {

                passengers.length === 0

                ?

                (

                  <p>

                    No passengers yet

                  </p>

                )

                :

                (

                  passengers.length === 1

                  ?

                  (

                    passengers.map((p)=>(

                      <div

                        key={p.bookingId}

                        className="passenger"

                      >

                        <p>

                          Name :

                          {p.userName}

                        </p>

                        <p>

                          Seats :

                          {p.seatsBooked}

                        </p>

                        <p>
Status :
{p.bookingStatus}
</p>

{
p.disputeRaised &&
p.reportedBy === "Passenger" && (

<div
style={{
border:"1px solid red",
padding:"10px",
marginTop:"10px",
borderRadius:"8px"
}}
>

<h4>🚨 Passenger Report</h4>

<p>
<b>Reason :</b> {p.reportReason}
</p>

<p>
<b>Description :</b> {p.reportDescription}
</p>

<p>
<b>Status :</b> {p.disputeStatus}
</p>

{
!p.driverDecision && (

<button
onClick={()=>
navigate(`/respond-report/${p.bookingId}`)
}
>
Respond
</button>

)
}

{
p.driverDecision && (

<div>

<div>

<p>
<b>Your Decision :</b> {p.driverDecision}
</p>

<p>
<b>Your Reason :</b> {p.driverReason || "-"}
</p>

<p>
<b>Your Message :</b> {p.driverMessage || "-"}
</p>

</div>
</div>

)
}

</div>

)
}


                        <hr />

                        <h4>

                          Pickup OTP

                        </h4>

{p.pickupOtpVerified ? (

<p>

✅ Pickup Verified

</p>

)

:

(

<>

<input
type="text"
placeholder="Enter Pickup OTP"
value={pickupOtps[p.bookingId] || ""}
onChange={(e)=>
setPickupOtps(prev=>({
...prev,
[p.bookingId]:e.target.value
}))
}
/>

<button
disabled={!pickupOtps[p.bookingId]}
onClick={()=>
verifyPickupOTP(p.bookingId)
}
>
Verify Pickup OTP
</button>

{
!p.disputeRaised &&
!p.pickupOtpVerified && (
<button
onClick={()=>
navigate(`/passenger-absent/${p.bookingId}`)
}
>
Passenger Absent
</button>
)
}

</>

)}

                        <br /><br />

 {
  p.pickupOtpVerified &&
  !p.disputeRaised && (
    <>
      <h4>Drop OTP</h4>

      {
        p.dropOtpVerified ? (
          <p>✅ Drop Verified</p>
        ) : (
          <>
            <input
              type="text"
              placeholder="Enter Drop OTP"
              value={dropOtps[p.bookingId] || ""}
              onChange={(e)=>
                setDropOtps(prev=>({
                  ...prev,
                  [p.bookingId]:e.target.value
                }))
              }
            />

        <button
disabled={!dropOtps[p.bookingId]}
onClick={()=>
verifyDropOTP(p.bookingId)
}
>
Verify Drop OTP
</button>
          </>
        )
      }
    </>
  )
}

                      </div>

                    ))

                  )

                  :


                  (

                    passengers.map((p) => (

                      <div

                        key={p.bookingId}

                        className="passenger"

                        style={{

                          border: "1px solid #ddd",

                          padding: "10px",

                          marginBottom: "15px",

                          borderRadius: "8px"

                        }}

                      >

                        <h4>

                          Passenger {p.userName}

                        </h4>

                        <p>

                          Seats : {p.seatsBooked}

                        </p>

{
p.disputeRaised &&
p.reportedBy === "Passenger" && (

<div
style={{
border:"1px solid red",
padding:"10px",
marginTop:"10px",
borderRadius:"8px"
}}
>

<h4>🚨 Passenger Report</h4>

<p><b>Reason :</b> {p.reportReason}</p>

<p><b>Description :</b> {p.reportDescription}</p>

<p><b>Status :</b> {p.disputeStatus}</p>

{
!p.driverDecision && (
<button
onClick={() =>
navigate(`/respond-report/${p.bookingId}`)
}
>
Respond
</button>
)
}

{
p.driverDecision && (
<div>
<p><b>Your Decision :</b> {p.driverDecision}</p>
<p><b>Your Reason :</b> {p.driverReason || "-"}</p>
<p><b>Your Message :</b> {p.driverMessage || "-"}</p>
</div>
)
}

</div>

)
}

                        <hr />



                        <h4>

                          Pickup OTP

                        </h4>
 
{p.pickupOtpVerified ? (

<p>

✅ Pickup Verified

</p>

)

:

(

<>

<input
type="text"
placeholder="Enter Pickup OTP"
value={pickupOtps[p.bookingId] || ""}
onChange={(e)=>
setPickupOtps(prev=>({
...prev,
[p.bookingId]:e.target.value
}))
}
/>

<button
disabled={!pickupOtps[p.bookingId]}
onClick={()=>
verifyPickupOTP(p.bookingId)
}
>
Verify Pickup OTP
</button>

{
!p.disputeRaised &&
!p.pickupOtpVerified && (

<button
onClick={() =>
navigate(`/passenger-absent/${p.bookingId}`)
}
>
Passenger Absent
</button>

)
}
</>

)}     


                        <br />

                        <br />

{
p.pickupOtpVerified &&
!p.disputeRaised &&
(
<>
<h4>Drop OTP</h4>

{
p.dropOtpVerified ? (

<p>✅ Drop Verified</p>

) : (

<>
<input
type="text"
placeholder="Enter Drop OTP"
value={dropOtps[p.bookingId] || ""}
onChange={(e)=>
setDropOtps(prev=>({
...prev,
[p.bookingId]:e.target.value
}))
}
/>

<button
disabled={!dropOtps[p.bookingId]}
onClick={()=>
verifyDropOTP(p.bookingId)
}
>
Verify Drop OTP
</button>
</>

)
}
</>
)
}

                      </div>

                    ))

                  )

                )

              }


<button

onClick={()=>{
    setShowModal(false);
    setPassengers([]);
    setSelectedRide(null);
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

export default MyRides;