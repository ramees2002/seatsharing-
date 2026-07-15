import React, { useEffect, useState } from "react";
import axios from "axios";

const AdminPayments = () => {

    const [payments, setPayments] = useState([]);

    const [filteredPayments, setFilteredPayments] = useState([]);

    const [filter, setFilter] = useState("All");


    useEffect(() => {

        fetchPayments();

    }, []);



    useEffect(() => {

        if (filter === "All") {

            setFilteredPayments(payments);

        } 
        else {

            setFilteredPayments(
                payments.filter(
                    payment => payment.status === filter
                )
            );

        }

    }, [filter, payments]);



    const fetchPayments = async () => {

        try {

            const res = await axios.get(
                "http://localhost:4000/admin/payments"
            );


            console.log("PAYMENTS:", res.data);


            setPayments(
                res.data.payments || []
            );


        } catch (error) {

            console.log(
                "Payment Fetch Error:",
                error
            );

        }

    };



    const updatePayment = async (paymentId, status) => {

        try {

            await axios.put(

                `http://localhost:4000/admin/payment/${paymentId}`,

                {
                    status,
                    remarks: "Changed by Admin"
                }

            );


            alert("Payment Updated");


            fetchPayments();


        } catch (error) {

            alert(
                error.response?.data?.message ||
                "Payment update failed"
            );

        }

    };



    return (

        <div className="admin-payments">


            <h1>
                Payment Management
            </h1>



            <select

                value={filter}

                onChange={(e)=>
                    setFilter(e.target.value)
                }

            >

                <option value="All">
                    All
                </option>


                <option value="Held">
                    Held
                </option>


                <option value="Released">
                    Released
                </option>


                <option value="Refunded">
                    Refunded
                </option>


                <option value="PendingAdmin">
                    PendingAdmin
                </option>


            </select>



            <hr />



            {
                filteredPayments.length === 0 ?

                (

                    <h3>
                        No Payments Found
                    </h3>

                )


                :


                (

                filteredPayments.map(payment => (


                    <div

                        key={payment._id}

                        style={{
                            border:"1px solid gray",
                            padding:"20px",
                            margin:"15px 0"
                        }}

                    >


                        <h3>
                            Payment Details
                        </h3>



                        <p>
                            Payment ID:
                            {" "}
                            {payment._id}
                        </p>



                        <p>
                            Booking:
                            {" "}
                            {
                                payment.bookingId?._id ||
                                payment.bookingId ||
                                "N/A"
                            }
                        </p>




<p>
    Passenger:
    {" "}
    {
        payment.passengerId?.Name ||
        payment.passengerId?.name ||
        "N/A"
    }
</p>


                  <p>
    Driver:
    {" "}
    {
        payment.driverId?.Name ||
        payment.driverId?.name ||
        "N/A"
    }
</p>




                        <p>
                            Amount:
                            ₹{payment.amount}
                        </p>



                        <p>
                            Driver Share:
                            ₹{payment.driverAmount}
                        </p>



                        <p>
                            Platform Fee:
                            ₹{payment.platformFee}
                        </p>



                        <p>
                            Status:
                            {payment.status}
                        </p>



                        {

                            payment.status === "Held" ||

                            payment.status === "PendingAdmin"


                            ?

                            <>


                            <button

                                onClick={() =>
                                    updatePayment(
                                        payment._id,
                                        "Released"
                                    )
                                }

                            >
                                Release
                            </button>



                            {" "}



                            <button

                                onClick={() =>
                                    updatePayment(
                                        payment._id,
                                        "Refunded"
                                    )
                                }

                            >
                                Refund
                            </button>


                            </>


                            :

                            <p>
                                Payment Finalized
                            </p>


                        }


                    </div>


                ))

                )

            }


        </div>

    );

};


export default AdminPayments;