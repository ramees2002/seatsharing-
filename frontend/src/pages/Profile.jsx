import React, { useEffect, useState } from "react";
import axios from "axios";

const Profile = () => {

  const user = JSON.parse(

    localStorage.getItem("user")

  );

  const [profile, setProfile] = useState({});

  const [vehicleNumber, setVehicleNumber] = useState("");

  const [vehicleType, setVehicleType] = useState("");

  const [reviews, setReviews] = useState([]);

const [averageRating, setAverageRating] = useState(0);

const [totalReviews, setTotalReviews] = useState(0);



  useEffect(() => {

    fetchProfile();
    fetchReviews();

  }, []);



  const fetchProfile = async () => {

    try {

      const res = await axios.get(

        `http://localhost:4000/users/profile/${user._id}`

      );

      setProfile(

        res.data.user

      );



      setVehicleNumber(

        res.data.user.vehicleNumber || ""

      );



      setVehicleType(

        res.data.user.vehicleType || ""

      );

    }

    catch (error) {

      console.log(error);

    }

  };


  const fetchReviews = async () => {

  try {

    const res = await axios.get(

      `http://localhost:4000/reviews/${user._id}`

    );

    setReviews(

      res.data.reviews

    );

    setAverageRating(

      res.data.averageRating

    );

    setTotalReviews(

      res.data.totalReviews

    );

  }

  catch (error) {

    console.log(error);

  }

};



  const updateVehicle = async () => {

    try {

      const res = await axios.put(

        `http://localhost:4000/users/vehicle/${user._id}`,

        {

          vehicleNumber,

          vehicleType

        }

      );



      alert(

        res.data.message

      );



      fetchProfile();

    }

    catch (error) {

      console.log(error);

    }

  };



  return (

    <div className="profile">

      <h1>

        My Profile

      </h1>



      <div className="profile-card">

        <p>

          <strong>Name :</strong>

          {profile.Name}

        </p>



        <p>

          <strong>Email :</strong>

          {profile.email}

        </p>



        <p>

          <strong>Phone :</strong>

          {profile.phone}

        </p>

   

<div className="rating-box">

  <h3>

    ⭐

    {

      Number(

        averageRating

      ).toFixed(1)

    }

  </h3>

  <p>

    {

      totalReviews

    }

    Reviews

  </p>

</div>


        <p>

          <strong>Vehicle Number :</strong>

          {profile.vehicleNumber || "Not Added"}

        </p>



        <p>

          <strong>Vehicle Type :</strong>

          {profile.vehicleType || "Not Added"}

        </p>



        <input

          type="text"

          placeholder="Vehicle Number"

          value={vehicleNumber}

          onChange={(e)=>

            setVehicleNumber(

              e.target.value

            )

          }

        />



        <input

          type="text"

          placeholder="Vehicle Type"

          value={vehicleType}

          onChange={(e)=>

            setVehicleType(

              e.target.value

            )

          }

        />



        <button

          onClick={updateVehicle}

        >

          Update Vehicle

        </button>


<h2>

Reviews

</h2>

{

reviews.length === 0 ?

(

<p>

No Reviews Yet

</p>

)

:

(

reviews.map(

(review)=>(

<div

key={review._id}

className="review-card"

>

<h4>

⭐

{

review.rating

}

</h4>

<p>

{

review.comment ||

"No Comment"

}

</p>

<p>

By :

{

review.reviewerId?.Name ||

review.reviewerId?.name ||

"Anonymous"

}

</p>

</div>

)

)

)

}


      </div>

    </div>

  );

};

export default Profile;