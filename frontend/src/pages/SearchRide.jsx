import React, { useState } from "react";
import axios from "axios";
import RideCard from "../components/RideCard";

const SearchRide = () => {

  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [date, setDate] = useState("");

  const [rides, setRides] = useState([]);

  const searchRide = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.get(

        "http://localhost:4000/rides/search",

        {

          params: {

            source,
            destination,
            date

          }

        }

      );

      setRides(res.data.rides);

    }

    catch (error) {

      console.log(error);

      alert("Search Failed");

    }

  };

  return (

    <div>

      <h1>
        Search Rides
      </h1>

      <form onSubmit={searchRide}>

        <input

          type="text"

          placeholder="Source"

          value={source}

          onChange={(e)=>

            setSource(

              e.target.value

            )

          }

        />

        <input

          type="text"

          placeholder="Destination"

          value={destination}

          onChange={(e)=>

            setDestination(

              e.target.value

            )

          }

        />

        <input

          type="date"

          value={date}

          onChange={(e)=>

            setDate(

              e.target.value

            )

          }

        />

        <button type="submit">

          Search

        </button>

      </form>

      {

        rides.length === 0 ?

        (

          <p>

            No Rides Found

          </p>

        )

        :

        (

          rides.map((ride)=>(

            <RideCard

              key={ride._id}

              ride={ride}

            />

          ))

        )

      }

    </div>

  );

};

export default SearchRide;