import React, { useState } from "react";
import { Link } from "react-router-dom";

interface LoginProps {
  setAuth: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
  // Define type for the inputs state
  interface InputState {
    username: string;
    password: string;
  }

  const [inputs, setInputs] = useState<InputState>({
    username: "",
    password: "",
  });

  const { username, password } = inputs;

  const onChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setInputs({ ...inputs, [e.target.name]: e.target.value });
  };

  const onSubmitForm = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    try {
      const body = { username, password };
      const response = await fetch("http://localhost:5001/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const parseRes = await response.json();
      console.log("Login response:", parseRes); 
      if (parseRes.token) {
        localStorage.setItem("token", parseRes.token);
        setAuth(true);
      } else {
        setAuth(false);
        alert("Login failed. Please check your credentials.");
      }
    } catch (err: any) {
      console.error("Login error:", err.message);
      alert("Login failed. Please check your credentials."); 
      setAuth(false); 
    }
  };

  return (
    <div className="container mt-5 bg-dark p-5 text-white mr-auto ml-auto rounded-3">
      <h1 className="text-center text-6xl">Login</h1>
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
