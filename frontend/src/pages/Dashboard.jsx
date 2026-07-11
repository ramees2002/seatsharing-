import React from "react";
import { Link } from "react-router";

const Dashboard = () => {

  const user = JSON.parse(localStorage.getItem("user"));

  return (

    <div className="dashboard">

      <h1>Welcome, {user?.name}</h1>

      <p>Manage your rides and bookings</p>

      <div className="dashboard-cards">

        <Link to="/create-ride" className="card">

          <h3>Create Ride</h3>

          <p>Offer a ride to passengers</p>

        </Link>

        <Link to="/search" className="card">

          <h3>Search Rides</h3>

          <p>Find available rides</p>

        </Link>

        <Link to="/my-rides" className="card">

          <h3>My Rides</h3>

          <p>View rides you created</p>

        </Link>

        <Link to="/my-bookings" className="card">

          <h3>My Bookings</h3>

          <p>Manage your bookings</p>

        </Link>

        <Link to="/reviews" className="card">

          <h3>Reviews</h3>

          <p>Check ratings and reviews</p>

        </Link>

        <Link to="/profile" className="card">

          <h3>Profile</h3>

          <p>Update account details</p>

        </Link>

      </div>

    </div>

  );

};

export default Dashboard;