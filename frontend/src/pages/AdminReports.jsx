import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const AdminReports = () => {

    const navigate = useNavigate();

    const [reports, setReports] = useState([]);

    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchReports();
    }, []);

    const fetchReports = async () => {

        try {

            const res = await axios.get(
                "http://localhost:4000/admin/reports"
            );

            setReports(res.data.reports);

        }

        catch (error) {

            console.log(error);

        }

        finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading Reports...</h2>;

    }

    return (

        <div className="admin-reports">

            <h1>Dispute Reports</h1>

            {

                reports.length === 0 ?

                    (

                        <h3>No Reports Found</h3>

                    )

                    :

                    (

                        reports.map((report) => (

                            <div
                                key={report._id}
                                className="report-card"
                            >

                                <h2>

                                    {report.disputeType || "Dispute"}

                                </h2>

                                <p>

                                    <b>Reported By :</b>

                                    {" "}

                                    {report.reportedBy}

                                </p>

                                <p>

                                    <b>Passenger :</b>

                                    {" "}

                                    {

                                        report.passengerId?.Name ||

                                        report.passengerId?.email

                                    }

                                </p>

                                <p>

                                    <b>Driver :</b>

                                    {" "}

                                    {

                                        report.rideId?.driverId?.Name ||

                                        report.rideId?.driverId?.email

                                    }

                                </p>

                                <p>

                                    <b>Reason :</b>

                                    {" "}

                                    {report.reportReason}

                                </p>

                                <p>

                                    <b>Description :</b>

                                    {" "}

                                    {report.reportDescription}

                                </p>

                                <p>

                                    <b>Passenger Decision :</b>

                                    {" "}

                                    {

                                        report.passengerDecision ||

                                        "Not Responded"

                                    }

                                </p>

                                <p>

                                    <b>Passenger Message :</b>

                                    {" "}

                                    {

                                        report.passengerMessage ||

                                        "-"

                                    }

                                </p>

                                <p>

                                    <b>Driver Decision :</b>

                                    {" "}

                                    {

                                        report.driverDecision ||

                                        "Not Responded"

                                    }

                                </p>

                                <p>

                                    <b>Driver Message :</b>

                                    {" "}

                                    {

                                        report.driverMessage ||

                                        "-"

                                    }

                                </p>

                                <p>

                                    <b>Status :</b>

                                    {" "}

                                    {report.disputeStatus}

                                </p>

                                <button

                                    onClick={() =>

                                        navigate(

                                            `/admin/report/${report._id}`

                                        )

                                    }

                                >

                                    Open Report

                                </button>

                            </div>

                        ))

                    )

            }

        </div>

    );

};

export default AdminReports;