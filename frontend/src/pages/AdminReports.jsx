import { useEffect, useState } from "react";
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

        } catch (error) {

            console.log(error);

        } finally {

            setLoading(false);

        }

    };

    if (loading) {

        return <h2>Loading...</h2>;

    }

    return (

        <div className="admin-reports">

            <h1>All Dispute Reports</h1>

            {
                reports.length === 0 ?

                    <h3>No Reports Found</h3>

                    :

                    reports.map((report) => (

                        <div
                            className="report-card"
                            key={report._id}
                        >

                            <h3>
                                {report.rideId?.source}
                                {" → "}
                                {report.rideId?.destination}
                            </h3>

                            <p>
                                <strong>Passenger:</strong>{" "}
                                {report.passengerId?.Name}
                            </p>

                            <p>
                                <strong>Driver:</strong>{" "}
                                {report.rideId?.driverId?.Name}
                            </p>

                            <p>
                                <strong>Report Type:</strong>{" "}
                                {report.disputeType}
                            </p>

                            <p>
                                <strong>Reported By:</strong>{" "}
                                {report.reportedBy}
                            </p>

                            <p>
                                <strong>Status:</strong>{" "}
                                {report.disputeStatus}
                            </p>

                            <button
                                onClick={() =>
                                    navigate(
                                        `/admin/report/${report._id}`
                                    )
                                }
                            >
                                View Details
                            </button>

                        </div>

                    ))
            }

        </div>

    );

};

export default AdminReports;