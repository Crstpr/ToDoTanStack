import React, { useState } from "react";
import { Link } from "react-router-dom";

const Register = ({setAuth}) => {
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
      const response = await fetch("http://localhost:5001/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json",token: localStorage.token },
        body: JSON.stringify(body),
      });
      const parseRes = await response.json();
      localStorage.setItem("token", parseRes.token);

      setAuth(true); 
      console.log(parseRes); // Log response for debugging
    } catch (err) {
      console.error(err.message);
    }
  };

  return (
    <div className="container mt-5 bg-dark p-5 text-white mr-auto ml-auto rounded-3">
      <h1 className="text-center my-5">Register</h1>
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
        <button className="btn btn-success btn-block">Register</button>
      </form>
      <Link to="/login">Already have an account? Login here</Link>
    </div>
  );
};

export default Register;
