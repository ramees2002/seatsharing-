import React from "react";
import { BrowserRouter, Routes, Route } from "react-router";
import ReportDetails from "./pages/ReportDetails";

import PlatformEarnings from "./pages/PlatformEarnings";

import AdminDashboard from "./pages/AdminDashboard";
import AdminReports from "./pages/AdminReports";
import AdminReportDetails from "./pages/AdminReportDetails";
import AdminPayments from "./pages/AdminPayments";
import AdminRides from "./pages/AdminRides";
import AdminRideDetails from "./pages/AdminRideDetails";
import AdminUsers from "./pages/AdminUsers";



import Navbar from "./components/Navbar";
import Footer from "./components/Footer";


import DriverEarnings from "./pages/DriverEarnings";

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


{/* =========================
    ADMIN DASHBOARD
========================= */}

<Route
    path="/admin"
    element={<AdminDashboard />}
/>

<Route
    path="/admin/dashboard"
    element={<AdminDashboard />}
/>

{/* =========================
    REPORTS
========================= */}

<Route
    path="/admin/reports"
    element={<AdminReports />}
/>

<Route
    path="/admin/report/:id"
    element={<AdminReportDetails />}
/>

{/* =========================
    PAYMENTS
========================= */}

<Route
    path="/admin/payments"
    element={<AdminPayments />}
/>

{/* =========================
    RIDES
========================= */}

<Route
    path="/admin/rides"
    element={<AdminRides />}
/>

<Route
    path="/admin/rides/:rideId"
    element={<AdminRideDetails />}
/>

{/* =========================
    USERS
========================= */}

<Route
    path="/admin/users"
    element={<AdminUsers />}
/>


<Route
    path="/admin/platform-earnings"
    element={<PlatformEarnings />}
/>

<Route
    path="/driver-earnings"
    element={<DriverEarnings />}
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