import React, { useState } from "react";
import axios from "axios";

const CreateRide = () => {

  const user = JSON.parse(localStorage.getItem("user"));

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


  const handleChange = (e) => {

    setRide({

      ...ride,

      [e.target.name]: e.target.value

    });

  };


  const handleSubmit = async (e) => {

    e.preventDefault();

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