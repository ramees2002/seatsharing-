import React, { useEffect, useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router";

const ReportDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const decideDispute = async (winner) => {

    try {

        if (winner === "Passenger") {

            await axios.put(
                `http://localhost:4000/admin/approve-passenger/${report._id}`
            );

        } else {

            await axios.put(
                `http://localhost:4000/admin/approve-driver/${report._id}`
            );

        }

        alert("Decision Saved");

        fetchReport();

    } catch (error) {

        alert(error.response?.data?.message || "Error");

    }

};

    useEffect(() => {

        fetchReport();

    }, []);

    const fetchReport = async () => {

        try {

            const res = await axios.get(

                `http://localhost:4000/bookings/report/${id}`

            );

            setReport(res.data.report);

        }

        catch (error) {

            console.log(error);

        }

    };

    if (!report) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="report-details">

            <h1>Report Details</h1>

            <hr />

            <h2>

                {report.rideId.source}

                →

                {report.rideId.destination}

            </h2>

            <p>

                <b>Report Type :</b>

                {report.disputeType}

            </p>

            <p>

                <b>Reported By :</b>

                {report.reportedBy}

            </p>

            <p>

                <b>Status :</b>

                {report.disputeStatus}

            </p>

            <hr />

<h3>
    {report.reportedBy === "Driver"
        ? "Driver Report"
        : "Passenger Report"}
</h3>

<p>
    <b>Reason :</b>{" "}
    {report.reportReason || "-"}
</p>

<p>
    <b>Description :</b>{" "}
    {report.reportDescription || "-"}
</p>

<p>
    <b>Wait Time :</b>{" "}
    {report.waitTime
        ? `${report.waitTime} Minutes`
        : "-"}
</p>

<p>
    <b>Contact Attempted :</b>{" "}
    {report.contactAttempted ? "Yes" : "No"}
</p>
            <hr />

            <h3>Driver Response</h3>

            <p>

                <b>Decision :</b>

                {report.driverDecision || "Not Responded"}

            </p>

            <p>

                <b>Reason :</b>

                {report.driverReason || "-"}

            </p>

            <p>

                <b>Message :</b>

                {report.driverMessage || "-"}

            </p>

            <hr />

            <h3>Passenger Response</h3>

            <p>

                <b>Decision :</b>

                {report.passengerDecision || "Not Responded"}

            </p>

            <p>

                <b>Reason :</b>

                {report.passengerReason || "-"}

            </p>

            <p>

                <b>Message :</b>

                {report.passengerMessage || "-"}

            </p>

            <hr />

            <h3>Admin Decision</h3>

            <p>

                <b>Resolved By :</b>

                {report.resolvedBy || "Pending"}

            </p>

            <p>

                <b>Resolved At :</b>

                {

                    report.resolvedAt

                    ?

                    new Date(report.resolvedAt).toLocaleString()

                    :

                    "-"

                }

            </p>

            <hr />

           {report.disputeStatus === "Pending" && (

    <>

        <button
            onClick={() => decideDispute("Passenger")}
        >
            Approve Passenger
        </button>

        <button
            onClick={() => decideDispute("Driver")}
        >
            Approve Driver
        </button>

    </>

)}



<button
    onClick={() => navigate(-1)}
>
    Back
</button>

        </div>

    );

};

export default ReportDetails;