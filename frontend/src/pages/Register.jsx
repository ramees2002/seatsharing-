import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Register = () => {

const navigate = useNavigate();

const [Name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [phone, setPhone] = useState("");
const [vehicleNumber, setVehicleNumber] = useState("");
const [vehicleType, setVehicleType] = useState("");

const registerUser = async (e) => {

e.preventDefault();

try {

const res = await axios.post(

"http://localhost:4000/users/register",

{

Name,
email,
password,
phone,
vehicleNumber,
vehicleType

}

);

alert(res.data.message);

navigate("/login");

}

catch(error){

alert(

error.response?.data?.message ||

"Registration Failed"

);

}

};

return (

<div>

<h1>Register</h1>

<form onSubmit={registerUser}>

<input

type="text"

placeholder="Name"

value={Name}

onChange={(e)=>setName(e.target.value)}

required

/>

<input

type="email"

placeholder="Email"

value={email}

onChange={(e)=>setEmail(e.target.value)}

required

/>

<input

type="password"

placeholder="Password"

value={password}

onChange={(e)=>setPassword(e.target.value)}

required

/>

<input

type="text"

placeholder="Phone"

value={phone}

onChange={(e)=>setPhone(e.target.value)}

required

/>

<input

type="text"

placeholder="Vehicle Number"

value={vehicleNumber}

onChange={(e)=>setVehicleNumber(e.target.value)}

/>

<select

value={vehicleType}

onChange={(e)=>setVehicleType(e.target.value)}

>

<option value="">

Select Vehicle Type

</option>

<option value="Sedan">

Sedan

</option>

<option value="SUV">

SUV

</option>

<option value="Hatchback">

Hatchback

</option>

<option value="MPV">

MPV

</option>

<option value="Electric">

Electric

</option>

<option value="Luxury">

Luxury

</option>

</select>

<button type="submit">

Register

</button>

</form>

</div>

);

};

export default Register;