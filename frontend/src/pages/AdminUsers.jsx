import { useEffect, useState } from "react";
import axios from "axios";

const AdminUsers = () => {

    const [users, setUsers] = useState([]);

    useEffect(() => {

        fetchUsers();

    }, []);

    const fetchUsers = async () => {

        try {

            const res = await axios.get(
                "http://localhost:4000/admin/users"
            );

            setUsers(res.data.users);

        }

        catch (error) {

            console.log(error);

        }

    };

    const deleteUser = async (id) => {

        if (!window.confirm("Delete this user?")) {

            return;

        }

        try {

            const res = await axios.delete(

                `http://localhost:4000/admin/users/${id}`

            );

            alert(res.data.message);

            fetchUsers();

        }

        catch (error) {

            alert(
                error.response?.data?.message
            );

        }

    };

    return (

        <div>

            <h1>User Management</h1>

            {

                users.length === 0

                ?

                <h3>No Users Found</h3>

                :

                users.map((user) => (

                    <div
                        key={user._id}
                        style={{
                            border: "1px solid #ccc",
                            padding: "20px",
                            marginBottom: "20px",
                            borderRadius: "8px"
                        }}
                    >

                        <h2>

                            {user.Name}

                        </h2>

                        <p>

                            <strong>Email :</strong>

                            {" "}

                            {user.email}

                        </p>

                        <p>

                            <strong>Phone :</strong>

                            {" "}

                            {user.phone}

                        </p>

                        <p>

                            <strong>Role :</strong>

                            {" "}

                            {user.role}

                        </p>

                        <p>

                            <strong>Vehicle Number :</strong>

                            {" "}

                            {user.vehicleNumber || "Not Added"}

                        </p>

                        <p>

                            <strong>Vehicle Type :</strong>

                            {" "}

                            {user.vehicleType || "Not Added"}

                        </p>

                        <p>

                            <strong>Rating :</strong>

                            {" "}

                            {user.rating || 0} ⭐

                        </p>

                        <p>

                            <strong>Reviews :</strong>

                            {" "}

                            {user.reviewCount || 0}

                        </p>

                        <p>

                            <strong>Joined :</strong>

                            {" "}

                            {

                                new Date(
                                    user.createdAt
                                ).toLocaleDateString()

                            }

                        </p>

                        <p>

                            <strong>User ID :</strong>

                            {" "}

                            {user._id}

                        </p>

                        {

                            user.role !== "admin"

                            &&

                            <button

                                onClick={() =>
                                    deleteUser(user._id)
                                }

                                style={{
                                    marginTop: "10px"
                                }}

                            >

                                Delete User

                            </button>

                        }

                    </div>

                ))

            }

        </div>

    );

};

export default AdminUsers;