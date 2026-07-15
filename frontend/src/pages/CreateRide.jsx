import React, { useState,useEffect} from "react";
import axios from "axios";

const CreateRide = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  const [userProfile, setUserProfile] = useState(null);
  const [ride, setRide] = useState({

    source: "",
    destination: "",
    date: "",
    departureTime: "",

    totalSeats: "",

    availableSeats: "",

    pricePerSeat: "",

    carName: ""

  });


useEffect(() => {

    fetchUserProfile();

}, []);

const fetchUserProfile = async () => {

    try {

        const res = await axios.get(

            `http://localhost:4000/users/profile/${user._id}`

        );

        setUserProfile(res.data.user);

    }

    catch (error) {

        console.log(error);

    }

};

  const handleChange = (e) => {

    setRide({

      ...ride,

      [e.target.name]: e.target.value

    });

  };


 const handleSubmit = async (e) => {

    e.preventDefault();

    if (

        !userProfile?.vehicleNumber ||

        !userProfile?.vehicleType

    ) {

        alert(

            "Please add your Vehicle Number and Vehicle Type in Profile before creating a ride."

        );

        return;

    }

    try {

      const data = {

        driverId: user._id,

        ...ride

      };


      const res = await axios.post(

        "http://localhost:4000/rides/create",

        data

      );


      alert(res.data.message);

      console.log(res.data);

    }

    catch (error) {

      console.log(error);

      alert(

        error.response?.data?.message ||

        "Ride Creation Failed"

      );

    }

  };


  return (

    <div className="ride-container">

      <h2>Create Ride</h2>

      {

userProfile &&

<div

style={{

border:"1px solid gray",

padding:"10px",

marginBottom:"20px"

}}

>

<p>

<b>Vehicle Number :</b>

{" "}

{userProfile.vehicleNumber || "Not Added"}

</p>

<p>

<b>Vehicle Type :</b>

{" "}

{userProfile.vehicleType || "Not Added"}

</p>

</div>

}

      <form onSubmit={handleSubmit}>


        <input

          type="text"

          name="source"

          placeholder="Source"

          value={ride.source}

          onChange={handleChange}

        />


        <input

          type="text"

          name="destination"

          placeholder="Destination"

          value={ride.destination}

          onChange={handleChange}

        />


        <input

          type="date"

          name="date"

          value={ride.date}

          onChange={handleChange}

        />


        <input

          type="time"

          name="departureTime"

          value={ride.departureTime}

          onChange={handleChange}

        />


        <input

          type="number"

          name="totalSeats"

          placeholder="Total Seats"

          min="1"

          value={ride.totalSeats}

          onChange={handleChange}

        />


        <input

          type="number"

          name="availableSeats"

          placeholder="Available Seats"

          min="0"

          value={ride.availableSeats}

          onChange={handleChange}

        />


        <input

          type="number"

          name="pricePerSeat"

          placeholder="Price Per Seat"

          min="1"

          value={ride.pricePerSeat}

          onChange={handleChange}

        />


        <input

          type="text"

          name="carName"

          placeholder="Car Name"

          value={ride.carName}

          onChange={handleChange}

        />


        <button type="submit">

          Create Ride

        </button>

      </form>

    </div>

  );

};

export default CreateRide;