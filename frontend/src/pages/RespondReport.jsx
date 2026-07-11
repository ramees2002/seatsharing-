import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const RespondReport = () => {

    const { bookingId } = useParams();

    const navigate = useNavigate();

    const user = JSON.parse(localStorage.getItem("user"));

    const [report, setReport] = useState(null);

    const [decision, setDecision] = useState("");

    const [reason, setReason] = useState("");

    const [message, setMessage] = useState("");

    useEffect(() => {

        loadReport();

    }, []);

    const loadReport = async () => {

        try {

            const res = await axios.get(

                `http://localhost:4000/bookings/report/${bookingId}`

            );

            setReport(res.data.report);

        }

        catch (error) {

            console.log(error);

        }

    };

    const submitResponse = async () => {

        try {

            const respondedBy =

                report.rideId.driverId._id === user._id

                ?

                "Driver"

                :

                "Passenger";

            await axios.put(

                `http://localhost:4000/bookings/absence-response/${bookingId}`,

                {

                    respondedBy,

                    decision,

                    reason,

                    message,

                    evidence: ""

                }

            );

            alert("Response submitted");

            navigate("/my-reports");

        }

        catch (error) {

            alert(error.response?.data?.message);

        }

    };

    if (!report) return <h2>Loading...</h2>;

    return (

        <div className="report-page">

            <h2>Respond To Report</h2>

            <hr/>

            <h3>Reported Reason</h3>

            <p>{report.reportReason}</p>

            <h3>Description</h3>

            <p>{report.reportDescription}</p>

            <h3>Waiting Time</h3>

            <p>{report.waitTime} Minutes</p>

            <hr/>

            <h3>Your Response</h3>

            <select

                value={decision}

                onChange={(e)=>setDecision(e.target.value)}

            >

                <option value="">Select</option>

                <option>Agree</option>

                <option>Disagree</option>

            </select>

            <br/><br/>

            <input

                type="text"

                placeholder="Reason"

                value={reason}

                onChange={(e)=>setReason(e.target.value)}

            />

            <br/><br/>

            <textarea

                rows="5"

                placeholder="Explain what happened"

                value={message}

                onChange={(e)=>setMessage(e.target.value)}

            />

            <br/><br/>

          <button
disabled={!decision || !reason.trim() || !message.trim()}
onClick={submitResponse}
>

    Submit Response

</button>

        </div>

    );

};

export default RespondReport;