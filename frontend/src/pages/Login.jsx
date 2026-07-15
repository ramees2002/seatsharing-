import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router";

const Login = () => {

  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res = await axios.post(

        "http://localhost:4000/users/login",

        {
          email,
          password
        }

      );

      localStorage.setItem(

        "token",

        res.data.token

      );

      localStorage.setItem(

        "userId",

        res.data.user._id

      );

      localStorage.setItem(

        "user",

        JSON.stringify(

          res.data.user

        )

      );

   alert(
    res.data.message
);


if (res.data.user.role === "admin") {

    navigate("/admin");

}
else {

    navigate("/dashboard");

}

    }

    catch (error) {

      alert(

        error.response?.data?.message ||

        "Login Failed"

      );

    }

  };

  return (

    <div>

      <h1>Login</h1>

      <form onSubmit={handleSubmit}>

        <input

          type="email"

          placeholder="Email"

          value={email}

          onChange={(e)=>

            setEmail(

              e.target.value

            )

          }

          required

        />

        <input

          type="password"

          placeholder="Password"

          value={password}

          onChange={(e)=>

            setPassword(

              e.target.value

            )

          }

          required

        />

        <button type="submit">

          Login

        </button>

      </form>

    </div>

  );

};

export default Login;