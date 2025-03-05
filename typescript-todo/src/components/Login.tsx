import React, { useState } from "react";
import { Link } from "react-router-dom";

interface LoginProps {
  setAuth: (isAuthenticated: boolean) => void;
}

const Login: React.FC<LoginProps> = ({ setAuth }) => {
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
    <div className="flex items-center justify-center h-screen bg-blue-950">
      <div className="bg-[#9AA6B2] p-10 rounded-xl w-full max-w-md">
        <h1 className="text-center text-3xl text-[#F8FAFC] font-mono mb-6">Login</h1>
        <form onSubmit={onSubmitForm} className="flex flex-col space-y-4">
          <input
            type="text"
            name="username"
            placeholder="Username"
            value={username}
            onChange={onChange}
            required
            className="bg-[#F8FAFC] border border-gray-300 text-blue-950 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent"
          />
          <input
            type="password"
            name="password"
            placeholder="Password"
            value={password}
            onChange={onChange}
            required
            className="bg-[#F8FAFC] border border-gray-300 text-blue-950 rounded-md py-2 px-4 focus:outline-none focus:ring-2 focus:ring-[#D9EAFD] focus:border-transparent"
          />
          <button
            className="bg-[#BCCCDC] hover:bg-[#9AA6B2] text-blue-950 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
          >
            Login
          </button>
        </form>
        <p className="mt-4 text-center text-sm text-[#D9EAFD]">
          <Link to="/register" className="hover:text-[#F8FAFC]">
            Don't have an account? Register here
          </Link>
        </p>
      </div>
    </div>
  );
};

export default Login;
