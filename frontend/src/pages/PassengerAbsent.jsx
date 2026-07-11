import { useState } from "react";
import { useParams, useNavigate } from "react-router";
import axios from "axios";

const PassengerAbsent = () => {

    const { bookingId } = useParams();

    const navigate = useNavigate();

    const [reason, setReason] = useState("");

    const [description, setDescription] = useState("");

    const [waitTime, setWaitTime] = useState("");

    const [contactAttempted, setContactAttempted] = useState(false);

    const submitReport = async () => {

        try {

await axios.put(
    `http://localhost:4000/bookings/noshow/${bookingId}`,
    {
        reportReason: reason,
        reportDescription: description,
        waitTime,
        contactAttempted
    }
);

            alert("Report submitted successfully");

            navigate("/my-reports");

        }

       catch (error) {

    console.log(error.response?.data);
    console.log(error);

    alert(
        error.response?.data?.message ||
        error.message
    );

}

    };

    return (

        <div className="report-page">

            <h2>Passenger Absent Report</h2>

            <label>Reason</label>

            <select

                value={reason}

                onChange={(e)=>setReason(e.target.value)}

            >

                <option value="">Select</option>

                <option>Passenger did not arrive</option>

                <option>Passenger cancelled verbally</option>

                <option>Passenger unreachable</option>

                <option>Passenger requested pickup elsewhere</option>

                <option>Passenger refused to travel</option>

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

                I tried contacting the passenger

            </label>

            <br/><br/>

            <button onClick={submitReport}>

                Submit Report

            </button>

        </div>

    );

};

export default PassengerAbsent;