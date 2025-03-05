import React, { useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TodoList from "./TodoList";


interface DashboardProps {
  setAuth: (isAuthenticated: boolean) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ setAuth }) => {
  const [name, setName] = useState<string>("");

  async function getName() {
    try {
      const response = await fetch("http://localhost:5001/dashboard/", {
        method: "GET",
        headers: { token: localStorage.token },
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
    <div className="flex h-screen  text-[#F8FAFC]">
      {/* Sidebar */}
      <aside className="w-64 bg-[#9AA6B2] p-6 flex flex-col rounded-r-lg shadow-lg">
        <h4 className="text-xl font-semibold mb-6 text-[#F8FAFC]">
          Welcome back, <span className="font-bold">{name}</span>
        </h4>
        <nav>
          <ul className="space-y-4">
            <li>
              <a href="#" className="text-[#F8FAFC] hover:text-[#D9EAFD] font-medium">
                Tasks
              </a>
            </li>
          </ul>
        </nav>
        <button
          onClick={(e) => logout(e)}
          className="mt-auto bg-[#BCCCDC] hover:bg-[#9AA6B2] text-blue-950 font-bold py-2 px-4 rounded-md focus:outline-none focus:shadow-outline"
        >
          Logout
        </button>
      </aside>

      <main className="flex-1 p-3 bg-[#D9EAFD] min-h-screen flex flex-col overflow-hidden">
      <h2 className="text-2xl font-bold mb-2 text-blue-950">Dashboard</h2>
        <div className="bg-[#F8FAFC] rounded-xl shadow-lg p-8 flex flex-col h-full" >
          <TaskForm />
          <div className="bg-[#F8FAFC] flex-1/2 overflow-auto">
          <TodoList />
          </div>

        </div>
      </main>
    </div>
  );
};

export default Dashboard;
