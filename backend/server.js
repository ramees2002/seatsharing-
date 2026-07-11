require("dotenv").config();
const express = require("express");
const app= express();
const cors=require("cors");
const userRoutes = require("./routes/userRoutes")
const rideRoutes = require("./routes/rideRoutes")
const reviewRoutes = require("./routes/reviewRoutes")
const bookingRoutes = require("./routes/bookingRoutes")
const paymentRoutes = require("./routes/paymentRoutes")
const adminRoutes = require("./routes/adminRoutes")



const mongoose = require("mongoose");

const port = 4000;

app.use(cors());
app.use(express.json());
mongoose.connect(process.env.CONNECTION)
.then(() => {
    console.log("✅ MongoDB Connected");
})
.catch((error) => {
    console.log("❌ MongoDB Connection Error:");
    console.log(error);
});
app.use("/users",userRoutes)
app.use("/rides",rideRoutes)
app.use("/reviews",reviewRoutes)
app.use("/bookings",bookingRoutes)
app.use("/payments",paymentRoutes)
console.log(adminRoutes);
app.use("/admin",adminRoutes)



app.listen(port,()=>{
   console.log( `port is connected at http://localhost:${port}`)
})