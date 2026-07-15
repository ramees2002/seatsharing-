import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const AdminReportDetails = () => {

    const { id } = useParams();

    const navigate = useNavigate();

    const [report, setReport] = useState(null);

    const [decision, setDecision] = useState("");

    const [remarks, setRemarks] = useState("");

    useEffect(() => {
        fetchReport();
    }, []);

    const fetchReport = async () => {

        try {

            const res = await axios.get(
                `http://localhost:4000/admin/reports/${id}`
            );

            setReport(res.data.report);

        } catch (error) {

            console.log(error);

        }

    };

   const resolveReport = async () => {

    if (!decision) {
        return alert("Select a decision");
    }

    try {


        if (decision === "DriverWins") {

            await axios.put(
                `http://localhost:4000/admin/approve-driver/${id}`,
                {
                    adminRemarks: remarks
                }
            );

        }


        else if (decision === "PassengerWins") {

            await axios.put(
                `http://localhost:4000/admin/approve-passenger/${id}`,
                {
                    adminRemarks: remarks
                }
            );

        }


        else if (decision === "RejectReport") {

            await axios.put(
                `http://localhost:4000/admin/close-report/${id}`,
                {
                    adminRemarks: remarks
                }
            );

        }


        alert("Report resolved");

        navigate("/admin/reports");


    } catch (error) {

        alert(
            error.response?.data?.message ||
            "Failed to resolve report"
        );

    }

};

    if (!report) {

        return <h2>Loading...</h2>;

    }

    return (

        <div>

            <h1>Report Details</h1>

            <hr />

            <h3>Ride</h3>

            <p>
                {report.rideId?.source} → {report.rideId?.destination}
            </p>

            <p>
                Driver :
                {report.rideId?.driverId?.Name}
            </p>

            <p>
                Passenger :
                {report.passengerId?.Name}
            </p>

            <hr />

            <h3>Report Information</h3>

            <p>
                Type :
                {report.disputeType}
            </p>

            <p>
                Reported By :
                {report.reportedBy}
            </p>

            <p>
                Reason :
                {report.reportReason}
            </p>

            <p>
                Description :
                {report.reportDescription}
            </p>

            <p>
                Wait Time :
                {report.waitTime}
            </p>

            <p>
                Contact Attempted :
                {report.contactAttempted ? "Yes" : "No"}
            </p>

            <hr />

            <h3>Driver Response</h3>

            <p>
                Decision :
                {report.driverDecision || "Waiting"}
            </p>

            <p>
                Reason :
                {report.driverReason || "-"}
            </p>

            <p>
                Message :
                {report.driverMessage || "-"}
            </p>

            <hr />

            <h3>Passenger Response</h3>

            <p>
                Decision :
                {report.passengerDecision || "Waiting"}
            </p>

            <p>
                Reason :
                {report.passengerReason || "-"}
            </p>

            <p>
                Message :
                {report.passengerMessage || "-"}
            </p>

            <hr />

            <h3>Admin Decision</h3>

            <select
                value={decision}
                onChange={(e) =>
                    setDecision(e.target.value)
                }
            >
                <option value="">
                    Select Decision
                </option>

                <option value="PassengerWins">
                    Passenger Wins
                </option>

                <option value="DriverWins">
                    Driver Wins
                </option>

                <option value="RejectReport">
                    Reject Report
                </option>

            </select>

            <br /><br />

            <textarea
                rows={5}
                placeholder="Admin remarks"
                value={remarks}
                onChange={(e) =>
                    setRemarks(e.target.value)
                }
            />

            <br /><br />

            <button onClick={resolveReport}>
                Resolve Report
            </button>

        </div>

    );

};

export default AdminReportDetails;