import React, { useState } from "react";
import axios from "axios";


const RideCard = ({ ride }) => {

const [seatsBooked, setSeatsBooked] = useState(1);

const [showProfile, setShowProfile] = useState(false);

const [reviews, setReviews] = useState([]);

const [averageRating, setAverageRating] = useState(0);

const [totalReviews, setTotalReviews] = useState(0);



const serviceFee = Math.round(

ride.pricePerSeat * 0.10

);

const totalAmount =

ride.pricePerSeat +

serviceFee;


const bookRide = async () => {

const passengerId =

localStorage.getItem("userId");


if (!passengerId) {

alert("Login Required");

return;

}


const amount =

ride.pricePerSeat *

seatsBooked;


try {

const orderRes = await axios.post(
"http://localhost:4000/payments/order",
{

passengerId,

driverId: ride.driverId._id,

amount

}
);

const order = orderRes.data.order;


const options = {

key:

import.meta.env.VITE_RAZORPAY_KEY,

amount:

order.amount,

currency:

order.currency,

name:

"Seat Sharing",

description:

"Ride Booking",

order_id:

order.id,

handler: async function(response){

try{

const bookingRes = await axios.post(

"http://localhost:4000/bookings/create",

{

rideId: ride._id,

passengerId,

seatsBooked

}

);


const booking =

bookingRes.data.booking;


await axios.post(

"http://localhost:4000/payments/verify",

{

razorpay_order_id:

response.razorpay_order_id,

razorpay_payment_id:

response.razorpay_payment_id,

razorpay_signature:

response.razorpay_signature,

bookingId:

booking._id,

passengerId,

driverId:

ride.driverId._id,

amount

}

);


alert(

"Booking Successful"

);

}
catch(error){

console.log(error);

alert(

"Booking failed"

);

}

},

theme:{

color:"#3399cc"

}

};


const rzp =

new window.Razorpay(

options

);

rzp.open();

}

catch(error){

console.log(error);

console.log(error.response?.data);

alert(

error.response?.data?.message ||

"Payment Failed"

);

}

};


const fetchReviews = async () => {

try {

const res = await axios.get(

`http://localhost:4000/reviews/${ride.driverId._id}`

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

setShowProfile(true);

}

catch(error){

console.log(error);

}

};

return (

<div className="ride-card">

<div className="driver-info">

<h3>

{

ride.driverId?.Name ||

"Driver"

}

</h3>

<p>

⭐

{

ride.driverId?.rating ||

0

}

</p>

</div>


<h2>

{ride.source}

→

{ride.destination}

</h2>


<p>

<b>Date :</b>

{

ride.date?.substring(

0,

10

)

}

</p>


<p>

<b>Time :</b>

{

ride.departureTime

}

</p>


<p>

<b>Seats :</b>

{

ride.availableSeats

}

/

{

ride.totalSeats

}

</p>


<p>

🚗

{

ride.carName

}

</p>


<p>

<b>Vehicle :</b>

{

ride.driverId?.vehicleType ||

"Not Added"

}

</p>


<p>

<b>Price :</b>

₹{

ride.pricePerSeat

}

/ seat

</p>


<p>

<b>Service Fee :</b>

₹{

serviceFee

}

</p>


<p>

<b>Total :</b>

₹{

totalAmount

}

</p>


<div>

<p>

Select Seats

</p>

<select

value={seatsBooked}

onChange={(e)=>

setSeatsBooked(

Number(

e.target.value

)

)

}

>

{

Array.from(

{

length:

ride.availableSeats

},

(_, i) => i + 1

).map(

(seat) => (

<option

key={seat}

value={seat}

>

{seat}

</option>

)

)

}

</select>

</div>



<button

onClick={fetchReviews}

>

View Profile

</button>



<button

onClick={bookRide}

disabled={

ride.availableSeats === 0

}

>

{

ride.availableSeats === 0

?

"Ride Full"

:

"Book Ride"

}

</button>



{

showProfile && (

<div className="profile-modal">

<div className="profile-content">

<button

onClick={() =>

setShowProfile(false)

}

>

✕

</button>


<h2>

{

ride.driverId?.Name

}

</h2>


<h3>

⭐

{

Number(

averageRating

).toFixed(1)

}

(

{

totalReviews

}

Reviews)

</h3>


<p>

Vehicle Type :

{

ride.driverId?.vehicleType ||

"Not Added"

}

</p>


<p>

Vehicle Number :

{

ride.driverId?.vehicleNumber ||

"Not Added"

}

</p>


<h3>

Reviews

</h3>


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

<p>

⭐

{

review.rating

}

</p>


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

)

}


</div>

);

};

export default RideCard;