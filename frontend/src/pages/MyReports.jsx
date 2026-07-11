import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const MyReports = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    const navigate = useNavigate();

    const [reports, setReports] = useState([]);

    useEffect(() => {

        fetchReports();

    }, []);

    const fetchReports = async () => {

        try {

            const res = await axios.get(

                `http://localhost:4000/bookings/my-reports/${user._id}`

            );

            setReports(res.data.reports);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="myreports">

            <h1>My Reports</h1>

            {

                reports.length === 0

                ?

                <h3>No Reports Found</h3>

                :

                reports.map(report => (

                    <div

                        className="report-card"

                        key={report._id}

                    >

                        <h3>

                            {report.rideId.source}

                            →

                            {report.rideId.destination}

                        </h3>

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

                            Status :

                            {report.disputeStatus}

                        </p>

                        <p>

                            Decision :

                            {

                                report.driverDecision ||

                                report.passengerDecision ||

                                "Waiting"

                            }

                        </p>

                     {(

    report.reportedBy === "Passenger" &&

    report.rideId.driverId._id === user._id &&

    !report.driverDecision

) ||

(

    report.reportedBy === "Driver" &&

    report.passengerId._id === user._id &&

    !report.passengerDecision

)

?

(

<button

    onClick={()=>

        navigate(

            `/respond-report/${report._id}`

        )

    }

>

    Respond

</button>

)

:

null

}

                        <button

                            onClick={()=>

                                navigate(

                                    `/report/${report._id}`

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

export default MyReports;