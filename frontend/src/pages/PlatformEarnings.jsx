import React, { useEffect, useState } from "react";
import axios from "axios";

const PlatformEarnings = () => {

    const [summary, setSummary] = useState(null);

    const [payments, setPayments] = useState([]);

    useEffect(() => {

        fetchEarnings();

    }, []);

    const fetchEarnings = async () => {

        try {

            const res = await axios.get(
                "http://localhost:4000/admin/platform-earnings"
            );

            setSummary({

                totalPlatformEarnings:
                    res.data.totalPlatformEarnings,

                releasedPlatformEarnings:
                    res.data.releasedPlatformEarnings,

                heldPlatformEarnings:
                    res.data.heldPlatformEarnings,

                refundedPlatformFees:
                    res.data.refundedPlatformFees,

                totalTransactions:
                    res.data.totalTransactions

            });

            setPayments(
                res.data.payments
            );

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!summary) {

        return <h2>Loading...</h2>;

    }

    return (

        <div style={{ padding: "20px" }}>

            <h1>Platform Earnings</h1>

            <hr />

            <h3>
                Total Earnings :
                ₹{summary.totalPlatformEarnings}
            </h3>

            <h3>
                Released Earnings :
                ₹{summary.releasedPlatformEarnings}
            </h3>

            <h3>
                Held Earnings :
                ₹{summary.heldPlatformEarnings}
            </h3>

            <h3>
                Refunded Fees :
                ₹{summary.refundedPlatformFees}
            </h3>

            <h3>
                Total Transactions :
                {summary.totalTransactions}
            </h3>

            <hr />

            <h2>Transaction History</h2>

            {

                payments.length === 0

                ?

                <h3>No Payments Found</h3>

                :

                payments.map(payment => (

                    <div

                        key={payment._id}

                        style={{

                            border: "1px solid gray",

                            padding: "15px",

                            marginBottom: "15px"

                        }}

                    >

                        <p>

                            Passenger :

                            {

                                payment.passengerId?.Name ||

                                payment.passengerId?.name ||

                                "N/A"

                            }

                        </p>

                        <p>

                            Driver :

                            {

                                payment.driverId?.Name ||

                                payment.driverId?.name ||

                                "N/A"

                            }

                        </p>

                        <p>

                            Platform Fee :

                            ₹{payment.platformFee}

                        </p>

                        <p>

                            Status :

                            {payment.status}

                        </p>

                        <p>

                            Date :

                            {

                                new Date(

                                    payment.createdAt

                                ).toLocaleDateString("en-IN")

                            }

                        </p>

                    </div>

                ))

            }

        </div>

    );

};

export default PlatformEarnings;