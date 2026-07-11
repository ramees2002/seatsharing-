import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const DriverAbsent = () => {

    const { bookingId } = useParams();

    const navigate = useNavigate();

    const [reason, setReason] = useState("");

    const [description, setDescription] = useState("");

    const [waitTime, setWaitTime] = useState("");

    const [contactAttempted, setContactAttempted] = useState(false);

    const submitReport = async () => {

        try {

            await axios.put(

                `http://localhost:4000/bookings/report-absence/${bookingId}`,

                {

                    disputeType: "DriverAbsent",

                    reportedBy: "Passenger",

                    reportReason: reason,

                    reportDescription: description,

                    waitTime,

                    contactAttempted,

                    evidence: ""

                }

            );

            alert("Report submitted successfully");

            navigate("/my-reports");

        }

        catch (error) {

            alert(

                error.response?.data?.message ||

                "Failed"

            );

        }

    };

    return (

        <div className="report-page">

            <h2>Driver Absent Report</h2>

            <label>Reason</label>

            <select

                value={reason}

                onChange={(e)=>setReason(e.target.value)}

            >

                <option value="">Select</option>

                <option>Driver did not arrive</option>

                <option>Driver cancelled verbally</option>

                <option>Driver unreachable</option>

                <option>Driver asked extra money</option>

                <option>Wrong pickup location</option>

                <option>Other</option>

            </select>

            <br/><br/>

            <label>How many minutes did you wait?</label>

            <input

                type="number"

                value={waitTime}

                onChange={(e)=>setWaitTime(e.target.value)}

            />

            <br/><br/>

            <label>Description</label>

            <textarea

                rows={5}

                value={description}

                onChange={(e)=>setDescription(e.target.value)}

            />

            <br/><br/>

            <label>

                <input

                    type="checkbox"

                    checked={contactAttempted}

                    onChange={(e)=>setContactAttempted(e.target.checked)}

                />

                I tried contacting the driver

            </label>

            <br/><br/>

            <button onClick={submitReport}>

                Submit Report

            </button>

        </div>

    );

};

export default DriverAbsent;