import React from "react";
import { Link, useNavigate } from "react-router";

const Navbar = () => {

const navigate = useNavigate();

const user = JSON.parse(

localStorage.getItem("user")

);

const logout = ()=>{

localStorage.removeItem("user");

localStorage.removeItem("token");

navigate("/login");

};


return(

<nav className="navbar">

<div className="logo">

<Link to="/">

CarPool

</Link>

</div>


<div className="links">

<Link to="/">

Home

</Link>


<Link to="/search">

Search Ride

</Link>


{

user &&

<>

<Link to="/create-ride">

Create Ride

</Link>


<Link to="/my-rides">

My Rides

</Link>


<Link to="/my-bookings">

My Bookings

</Link>


<Link to="/reviews">

Reviews

</Link>


<Link to="/profile">

Profile

</Link>


<Link to="/dashboard">

Dashboard

</Link>

</>

}


{

!user ?

<>

<Link to="/login">

Login

</Link>


<Link to="/register">

Register

</Link>

</>

:

<button

onClick={logout}

>

Logout

</button>

}


</div>

</nav>

);

};

export default Navbar;