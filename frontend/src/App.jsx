import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ReportDetails from "./pages/ReportDetails";



import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import AdminReports from "./pages/AdminReports";

import DriverAbsent from "./pages/DriverAbsent";
import PassengerAbsent from "./pages/PassengerAbsent";
import RespondReport from "./pages/RespondReport";
import MyReports from "./pages/MyReports";

import Home from "./pages/Home";
import Login from "./pages/Login";
import Register from "./pages/Register";

import CreateRide from "./pages/CreateRide";
import SearchRide from "./pages/SearchRide";
import MyRides from "./pages/MyRides";

import MyBookings from "./pages/MyBookings";

import Profile from "./pages/Profile";
import Reviews from "./pages/Reviews";
import Dashboard from "./pages/Dashboard";
import RideCard from "./components/RideCard";

function App() {

  return (

    <BrowserRouter>

      <Navbar />

      <Routes>

        <Route
path="/report/:id"
element={<ReportDetails/>}
/>

        <Route
          path="/"
          element={<Home />}
        />

        <Route
          path="/login"
          element={<Login />}
        />

        <Route
          path="/register"
          element={<Register />}
        />

        <Route
          path="/create-ride"
          element={<CreateRide />}
        />

        <Route
          path="/search"
          element={<SearchRide />}
        />

        <Route
          path="/my-rides"
          element={<MyRides />}
        />

        <Route
          path="/my-bookings"
          element={<MyBookings />}
        />


        <Route
          path="/profile"
          element={<Profile />}
        />

        <Route
          path="/reviews"
          element={<Reviews />}
        />

        <Route
          path="/dashboard"
          element={<Dashboard />}
        />


<Route
path="/admin-reports"
element={<AdminReports/>}
/>


<Route path="/driver-absent/:bookingId" element={<DriverAbsent />} />

<Route path="/passenger-absent/:bookingId" element={<PassengerAbsent />} />

<Route path="/respond-report/:bookingId" element={<RespondReport />} />

<Route path="/my-reports" element={<MyReports />} />
        

      </Routes>

      <Footer />

    </BrowserRouter>

  );

}

export default App;