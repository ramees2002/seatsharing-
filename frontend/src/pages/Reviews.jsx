import React, { useEffect, useState } from "react";
import axios from "axios";

const Reviews = () => {

const user = JSON.parse(
localStorage.getItem("user")
);

const [reviews,setReviews] = useState([]);

const [rating,setRating] = useState("");

const [comment,setComment] = useState("");

const [targetUserId,setTargetUserId] = useState("");

const [rideId,setRideId] = useState("");


useEffect(()=>{

fetchReviews();

},[]);


const fetchReviews = async()=>{

try{

const res = await axios.get(

`http://localhost:4000/reviews/${user._id}`

);

setReviews(

res.data.reviews

);

}

catch(error){

console.log(error);

}

};



const addReview = async(e)=>{

e.preventDefault();

try{

const res = await axios.post(

"http://localhost:4000/reviews/create",

{

reviewerId:user._id,

targetUserId,

rideId,

rating,

comment

}

);

alert(

res.data.message

);

fetchReviews();

setRating("");

setComment("");

setTargetUserId("");

setRideId("");

}

catch(error){

console.log(error);

}

};



return(

<div className="reviews">

<h1>

Reviews

</h1>


<form onSubmit={addReview}>


<input

type="text"

placeholder="Target User Id"

value={targetUserId}

onChange={(e)=>setTargetUserId(

e.target.value

)}

/>


<input

type="text"

placeholder="Ride Id"

value={rideId}

onChange={(e)=>setRideId(

e.target.value

)}

/>


<input

type="number"

placeholder="Rating"

min="1"

max="5"

value={rating}

onChange={(e)=>setRating(

e.target.value

)}

/>


<textarea

placeholder="Comment"

value={comment}

onChange={(e)=>setComment(

e.target.value

)}

/>


<button>

Submit Review

</button>


</form>



{

reviews.length===0 ?

(

<p>

No Reviews Found

</p>

)

:

(

reviews.map((review)=>(

<div

className="review-card"

key={review._id}

>

<h3>

⭐ {review.rating}/5

</h3>


<p>

{

review.comment

}

</p>


<p>

Ride :

{

review.rideId?._id

}

</p>


<p>

Reviewer :

{

review.reviewerId?.Name

}

</p>


</div>

))

)

}


</div>

);

};

export default Reviews;