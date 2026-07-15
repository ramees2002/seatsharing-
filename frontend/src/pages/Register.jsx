import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Register = () => {

const navigate = useNavigate();

const [Name, setName] = useState("");
const [email, setEmail] = useState("");
const [password, setPassword] = useState("");
const [phone, setPhone] = useState("");


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





<button type="submit">

Register

</button>

</form>

</div>

);

};

export default Register;