import React, { useState } from "react";
import { Link } from "react-router-dom";

const Login = ({ setAuth }) => {
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
  });

  const { username, password } = inputs;

  const onChange = (e) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e) => {
    e.preventDefault();
    try {
      const body = { username, password };
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      console.log(parseRes); // Debugging response

      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
        alert("Login failed. Please check your credentials.");
      }
    } catch (err) {
      console.error("Error:", err.message);
    }
  };

  return (
    <div className="container mt-5 bg-dark p-5 text-white mr-auto ml-auto rounded-3">
      <h1 className="text-center my-5">Login</h1>
      <form onSubmit={onSubmitForm}>
        <input
          type="text"
          name="username"
          placeholder="Username"
          className="form-control my-3"
          value={username}
          onChange={onChange}
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          className="form-control my-3"
          value={password}
          onChange={onChange}
          required
        />
        <button className="btn btn-success w-100">Login</button>
      </form>
      <div className="text-center mt-3">
        <Link to="/register">Don't have an account yet? Register here</Link>
      </div>
    </div>
  );
};

export default Login;
