import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TodoList from "./TodoList";

interface DashboardProps {
  setAuth: (isAuthenticated: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setAuth }) => {
  const [name, setName] = useState<string>(""); // Initialize as an empty string

  async function getName() {
    try {
      const response = await fetch("http://localhost:5001/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token }, // Handle null token case
      });

      const parseRes = await response.json();

        setName(parseRes.username);

    } catch (err: any) {
      console.error("Error fetching name:", err.message);
    }
  }

  const logout = (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    localStorage.removeItem("token");
    setAuth(false);
  };

  useEffect(() => {
    getName();
  }, []); 

  return (
    <div>
        <h4 className="position-absolute top-0 start-50 mt-5 translate-middle">Welcome back, {name}</h4>
        <div>
      <TaskForm />
      <TodoList />
      <p></p>
      <p></p>
      <button onClick={(e) => logout(e)} className="bg-lime-800 rounded-5">
        Logout
      </button>
    </div>
    </div>
    
  );
};

export default Dashboard;
