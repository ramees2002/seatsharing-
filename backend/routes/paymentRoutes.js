const express = require("express");
const crypto = require("crypto");

const router = express.Router();
const Razorpay = require("razorpay");
const Payment = require("../models/Paymentmodel");


// ======================
// RAZORPAY INSTANCE (IMPORTANT: create here directly)
// ======================

const razorpay = new Razorpay({
    key_id: process.env.RAZORPAY_KEY_ID,
    key_secret: process.env.RAZORPAY_KEY_SECRET
});

console.log("🔥 Razorpay Initialized:", !!razorpay);


// ======================
// CREATE ORDER
// ======================

router.post("/order", async (req, res) => {
    try {

        console.log("🚨 ORDER ROUTE HIT");
        console.log("BODY:", req.body);

        const { amount } = req.body;

        if (!amount) {
            return res.status(400).json({
                message: "Amount required"
            });
        }

        const options = {
            amount: Number(amount) * 100,
            currency: "INR",
            receipt: `ride_${Date.now()}`
        };

        console.log("OPTIONS:", options);

        const order = await razorpay.orders.create(options);

        return res.status(200).json({
            success: true,
            order
        });

    } catch (error) {

        console.log("🔥 RAZORPAY ERROR:", error);
        console.log(error?.stack);

        return res.status(500).json({
            message: error.message,
            error
        });
    }
});


// ======================
// VERIFY PAYMENT
// ======================

router.post("/verify", async (req, res) => {
    try {

        const {
            razorpay_order_id,
            razorpay_payment_id,
            razorpay_signature,
            bookingId,
            passengerId,
            driverId,
            amount
        } = req.body;

        const body = razorpay_order_id + "|" + razorpay_payment_id;

        const expectedSignature = crypto
            .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
            .update(body)
            .digest("hex");

        if (expectedSignature !== razorpay_signature) {
            return res.status(400).json({
                message: "Payment verification failed"
            });
        }

        const commission = amount * 0.10;
        const driverAmount = amount - commission;

       const payment = await Payment.create({
    bookingId,
    passengerId,
    driverId,
    amount,
    commission,
    driverAmount,
    status: "Held"
});

        return res.status(200).json({
            message: "Payment Successful",
            payment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});


// ======================
// GET PAYMENTS
// ======================

router.get("/my-payments/:id", async (req, res) => {
    try {
        const payments = await Payment.find({
            passengerId: req.params.id
        });

        res.status(200).json({ payments });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});


// ======================
// DRIVER PAYMENTS
// ======================

router.get("/driver/:id", async (req, res) => {
    try {
        const payments = await Payment.find({
            driverId: req.params.id
        });

        res.status(200).json({ payments });

    } catch (error) {
        res.status(500).json({
            message: error.message
        });
    }
});



router.put("/release/:bookingId", async (req,res)=>{

    try{

        const payments = await Payment.find({

            bookingId:req.params.bookingId,

            status:"Held"

        });

        if(payments.length===0){

            return res.status(404).json({

                message:"No held payments found"

            });

        }

        for(const payment of payments){

            payment.status="Released";

            await payment.save();

        }

        return res.status(200).json({

            message:"Payments released",

            payments

        });

    }

    catch(error){

        return res.status(500).json({

            message:error.message

        });

    }

});


// ======================
// REFUND
// ======================

router.put("/refund/:id", async (req, res) => {
    try {

        const payment = await Payment.findById(req.params.id);

        if (!payment) {
            return res.status(404).json({
                message: "Payment not found"
            });
        }

        payment.status = "Refunded";
        await payment.save();

        return res.status(200).json({
            message: "Refund successful",
            payment
        });

    } catch (error) {
        return res.status(500).json({
            message: error.message
        });
    }
});

module.exports = router;