import { useEffect, useState } from "react";
import { useNavigate } from "react-router";
import axios from "axios";

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [stats, setStats] = useState({

        totalReports: 0,
        pendingReports: 0,
        resolvedReports: 0,
        totalRides: 0

    });

    useEffect(() => {

        fetchStats();

    }, []);

    const fetchStats = async () => {

        try {

            const res = await axios.get(

                "http://localhost:4000/admin/stats"

            );

            setStats(res.data);

        }

        catch (error) {

            console.log(error);

        }

    };

    return (

        <div className="admin-dashboard">

            <h1>Admin Dashboard</h1>

            <hr />

            <div
                style={{
                    display: "flex",
                    gap: "20px",
                    flexWrap: "wrap"
                }}
            >

                <div
                    style={{
                        border: "1px solid gray",
                        padding: "20px",
                        width: "220px"
                    }}
                >
                    <h3>Total Reports</h3>

                    <h2>{stats.totalReports}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid gray",
                        padding: "20px",
                        width: "220px"
                    }}
                >
                    <h3>Pending Reports</h3>

                    <h2>{stats.pendingReports}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid gray",
                        padding: "20px",
                        width: "220px"
                    }}
                >
                    <h3>Resolved Reports</h3>

                    <h2>{stats.resolvedReports}</h2>
                </div>

                <div
                    style={{
                        border: "1px solid gray",
                        padding: "20px",
                        width: "220px"
                    }}
                >
                    <h3>Total Rides</h3>

                    <h2>{stats.totalRides}</h2>
                </div>

            </div>

            <hr />

            <h2>Management</h2>

            <div
                style={{
                    display: "flex",
                    flexWrap: "wrap",
                    gap: "20px"
                }}
            >

                <button
                    onClick={() =>
                        navigate("/admin/reports")
                    }
                >
                    Manage Reports
                </button>

                <button
                    onClick={() =>
                        navigate("/admin/payments")
                    }
                >
                    Manage Payments
                </button>

                <button
                    onClick={() =>
                        navigate("/admin/rides")
                    }
                >
                    Manage Rides
                </button>

                <button
                    onClick={() =>
                        navigate("/admin/users")
                    }
                >
                    Manage Users
                </button>


                <button
    onClick={() =>
        navigate("/admin/platform-earnings")
    }
>
    Platform Earnings
</button>

            </div>

            <hr />

            <button
                onClick={fetchStats}
            >
                Refresh Dashboard
            </button>

        </div>

    );

};

export default AdminDashboard;