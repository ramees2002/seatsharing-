import React, { useEffect, useState } from "react";
import axios from "axios";

const DriverEarnings = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const [summary, setSummary] = useState(null);

    const [payments, setPayments] = useState([]);

    const [filteredPayments, setFilteredPayments] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [lastUpdated, setLastUpdated] = useState("");

    const [searchTerm, setSearchTerm] = useState("");

    const [statusFilter, setStatusFilter] = useState("All");

    const [currentPage, setCurrentPage] = useState(1);

    const itemsPerPage = 5;



    // ============================
    // FETCH DRIVER SUMMARY
    // ============================

    const fetchSummary = async () => {

        try {

            setLoading(true);

            const res = await axios.get(

                `http://localhost:4000/payments/driver-summary/${user._id}`

            );

            setSummary(res.data);

            setPayments(res.data.payments || []);

            setLastUpdated(

                new Date().toLocaleString()

            );

            setError("");

        }

        catch (err) {

            console.log(err);

            setError(

                err.response?.data?.message ||

                "Unable to load earnings"

            );

        }

        finally {

            setLoading(false);

        }

    };



    // ============================
    // INITIAL LOAD
    // ============================

    useEffect(() => {

        if (user?._id) {

            fetchSummary();

        }

    }, []);



    // ============================
    // AUTO REFRESH
    // ============================

    useEffect(() => {

        const interval = setInterval(() => {

            if (user?._id) {

                fetchSummary();

            }

        }, 30000);

        return () => clearInterval(interval);

    }, []);




    // ============================
    // FORMAT CURRENCY
    // ============================

    const formatCurrency = (amount) => {

        return Number(amount || 0).toLocaleString(

            "en-IN",

            {

                style: "currency",

                currency: "INR",

                minimumFractionDigits: 2

            }

        );

    };




    // ============================
    // FORMAT DATE
    // ============================

    const formatDate = (date) => {

        if (!date) return "-";

        return new Date(date).toLocaleString(

            "en-IN",

            {

                day: "2-digit",

                month: "short",

                year: "numeric",

                hour: "2-digit",

                minute: "2-digit"

            }

        );

    };




    // ============================
    // CLEAR FILTERS
    // ============================

    const clearFilters = () => {

        setSearchTerm("");

        setStatusFilter("All");

        setCurrentPage(1);

    };

    // ============================
    // FILTER PAYMENTS
    // ============================

    useEffect(() => {

        if (!payments.length) {

            setFilteredPayments([]);

            return;

        }

        let temp = [...payments];

        // Newest First

        temp.sort(

            (a, b) =>

                new Date(b.createdAt) -

                new Date(a.createdAt)

        );

        // Status Filter

        if (statusFilter !== "All") {

            temp = temp.filter(

                payment =>

                    payment.status === statusFilter

            );

        }

        // Search Booking ID / Payment ID

        if (searchTerm.trim() !== "") {

            temp = temp.filter(payment => {

                const bookingId = String(

                    payment.bookingId?._id ||

                    payment.bookingId ||

                    ""

                ).toLowerCase();

                const paymentId = String(

                    payment._id

                ).toLowerCase();

                const search = searchTerm.toLowerCase();

                return (

                    bookingId.includes(search)

                    ||

                    paymentId.includes(search)

                );

            });

        }

        setFilteredPayments(temp);

        setCurrentPage(1);

    }, [

        payments,

        searchTerm,

        statusFilter

    ]);





    // ============================
    // SUMMARY CALCULATIONS
    // ============================

    const grossRevenue = payments.reduce(

        (sum, payment) =>

            sum + (payment.amount || 0),

        0

    );



    const heldAmount = payments

        .filter(

            payment =>

                payment.status === "Held"

        )

        .reduce(

            (sum, payment) =>

                sum + payment.driverAmount,

            0

        );



    const releasedAmount = payments

        .filter(

            payment =>

                payment.status === "Released"

        )

        .reduce(

            (sum, payment) =>

                sum + payment.driverAmount,

            0

        );



    const pendingAdminAmount = payments

        .filter(

            payment =>

                payment.status === "PendingAdmin"

        )

        .reduce(

            (sum, payment) =>

                sum + payment.driverAmount,

            0

        );



    const refundedAmount = payments

        .filter(

            payment =>

                payment.status === "Refunded"

        )

        .reduce(

            (sum, payment) =>

                sum + payment.amount,

            0

        );



    const platformFee = payments.reduce(

        (sum, payment) =>

            sum + (payment.platformFee || 0),

        0

    );





    // ============================
    // PAGINATION
    // ============================

    const totalPages = Math.ceil(

        filteredPayments.length /

        itemsPerPage

    );



    const indexOfLastItem =

        currentPage *

        itemsPerPage;



    const indexOfFirstItem =

        indexOfLastItem -

        itemsPerPage;



    const currentPayments =

        filteredPayments.slice(

            indexOfFirstItem,

            indexOfLastItem

        );





    // ============================
    // EXPORT CSV
    // ============================

    const exportCSV = () => {

        if (

            filteredPayments.length === 0

        ) return;

        const headers = [

            "Booking ID",

            "Payment ID",

            "Passenger Paid",

            "Platform Fee",

            "Driver Amount",

            "Status",

            "Remarks",

            "Created",

            "Released"

        ];



        const rows = filteredPayments.map(

            payment => [

                payment.bookingId?._id ||

                payment.bookingId,

                payment._id,

                payment.amount,

                payment.platformFee,

                payment.driverAmount,

                payment.status,

                payment.paymentHistory?.length

                    ?

                    payment.paymentHistory[

                        payment.paymentHistory.length - 1

                    ].remarks

                    :

                    "",

                formatDate(

                    payment.createdAt

                ),

                formatDate(

                    payment.releasedAt

                )

            ]

        );



        const csv =

            "data:text/csv;charset=utf-8," +

            [

                headers.join(","),

                ...rows.map(

                    row => row.join(",")

                )

            ].join("\n");



        const encoded =

            encodeURI(csv);



        const link =

            document.createElement("a");



        link.setAttribute(

            "href",

            encoded

        );



        link.setAttribute(

            "download",

            "Driver_Earnings.csv"

        );



        document.body.appendChild(link);



        link.click();



        document.body.removeChild(link);

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="driver-earnings-container">

            <h1>

                Driver Earnings Dashboard

            </h1>

         <button
    onClick={fetchSummary}
>
    Refresh
</button>
            <hr />



            {/* SUMMARY CARDS */}



            <div className="earnings-grid">

                <div className="earn-card">

                    <h3>

                  passenger payments

                    </h3>

                    <h2>

                        ₹{grossRevenue}

                    </h2>

                </div>



                <div className="earn-card">

                    <h3>

                        Avaliable Earnings

                    </h3>

                    <h2>

                        ₹{releasedAmount}

                    </h2>

                </div>



                <div className="earn-card">

                    <h3>

                        Held

                    </h3>

                    <h2>

                        ₹{heldAmount}

                    </h2>

                </div>



                <div className="earn-card">

                    <h3>

                        Pending Admin

                    </h3>

                    <h2>

                        ₹{pendingAdminAmount}

                    </h2>

                </div>



                <div className="earn-card">

                    <h3>

                        Refunded

                    </h3>

                    <h2>

                        ₹{refundedAmount}

                    </h2>

                </div>



                <div className="earn-card">

                    <h3>

                        Platform Fee

                    </h3>

                    <h2>

                        ₹{platformFee}

                    </h2>

                </div>



                <div className="earn-card">

                    <h3>

                        Total Payments

                    </h3>

                    <h2>

                        {payments.length}

                    </h2>

                </div>

            </div>



            <hr />



            {/* FILTERS */}



            <div className="toolbar">

                <input

                    type="text"

                    placeholder="Search Booking ID"

                    value={searchTerm}

                    onChange={(e)=>

                        setSearchTerm(

                            e.target.value

                        )

                    }

                />



                <select

                    value={statusFilter}

                    onChange={(e)=>

                        setStatusFilter(

                            e.target.value

                        )

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



                    <option value="PendingAdmin">

                        Pending Admin

                    </option>



                    <option value="Refunded">

                        Refunded

                    </option>

                </select>



                <button

                    onClick={clearFilters}

                >

                    Clear

                </button>



                <button

                    onClick={exportCSV}

                >

                    Export CSV

                </button>

            </div>

            <hr />
            {/* PAYMENT TABLE */}

            {

                filteredPayments.length === 0 ?

                (

                    <h3>

                        No Payments Found

                    </h3>

                )

                :

                (

                    <>

                        <table className="payments-table">

                            <thead>

                                <tr>

                                    <th>

                                        Booking ID

                                    </th>

                                    <th>

                                        Passenger Paid

                                    </th>

                                    <th>

                                        Platform Fee

                                    </th>

                                    <th>

                                        Driver Amount

                                    </th>

                                    <th>

                                        Status

                                    </th>

                                    <th>

                                        Last Remark

                                    </th>

                                    <th>

                                        Created

                                    </th>

                                    <th>

                                        Released

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {

                                    currentPayments.map((payment)=>(

                                        <tr

                                            key={payment._id}

                                        >

                                            <td>

                                                {

                                                    payment.bookingId?._id ||

                                                    payment.bookingId

                                                }

                                            </td>

                                            <td>

                                                ₹{payment.amount}

                                            </td>

                                            <td>

                                                ₹{payment.platformFee}

                                            </td>

                                            <td>

                                                ₹{payment.driverAmount}

                                            </td>

                                            <td>

                                                <span

                                                    className={`status ${payment.status}`}

                                                >

                                                    {

                                                        payment.status

                                                    }

                                                </span>

                                            </td>

                                            <td>

                                                {

                                                    payment.paymentHistory?.length

                                                    ?

                                                    payment.paymentHistory[

                                                        payment.paymentHistory.length-1

                                                    ].remarks

                                                    :

                                                    "-"

                                                }

                                            </td>

                                            <td>

                                                {

                                                    formatDate(

                                                        payment.createdAt

                                                    )

                                                }

                                            </td>

                                            <td>

                                                {

                                                    payment.status==="Released"

                                                    ?

                                                    formatDate(

                                                        payment.releasedAt

                                                    )

                                                    :

                                                    "-"

                                                }

                                            </td>

                                        </tr>

                                    ))

                                }

                            </tbody>

                        </table>



                        <br />



                        {/* PAGINATION */}

                        {

                            totalPages > 1 &&

                            (

                                <div

                                    className="pagination"

                                >

                                    <button

                                        disabled={currentPage===1}

                                        onClick={()=>

                                            setCurrentPage(

                                                currentPage-1

                                            )

                                        }

                                    >

                                        Previous

                                    </button>



                                    <span>

                                        Page

                                        {" "}

                                        {

                                            currentPage

                                        }

                                        {" "}

                                        of

                                        {" "}

                                        {

                                            totalPages

                                        }

                                    </span>



                                    <button

                                        disabled={

                                            currentPage===totalPages

                                        }

                                        onClick={()=>

                                            setCurrentPage(

                                                currentPage+1

                                            )

                                        }

                                    >

                                        Next

                                    </button>

                                </div>

                            )

                        }

                    </>

                )

            }

        </div>

    );

};

export default DriverEarnings;