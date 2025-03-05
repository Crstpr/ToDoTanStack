import "./App.css";
import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);

  const setAuth = (boolean: boolean) => {
    setIsAuthenticated(boolean);
  };

  const isAuth = async () => {
    try {
      const token = localStorage.getItem("token");
      if (!token) {
        setAuth(false);
        return;
      }
      const payload = JSON.parse(atob(token.split(".")[1]));
      const isExpired = payload.exp * 1000 < Date.now();
  
      if (isExpired) {
        console.warn("Token expired, logging out...");
        localStorage.removeItem("token");
        setAuth(false);
        return;
      }

      const response = await fetch("http://localhost:5001/auth/is-verify", {
        method: "GET",
        headers: { token: token },
      });

      if (!response.ok) {
        console.warn(`Authentication check failed with status: ${response.status}`);
        setAuth(false);
        return;
      }

      const parseRes: boolean = await response.json(); // Explicitly type parseRes as boolean
      setIsAuthenticated(parseRes);
    } catch (err: any) {
      console.error("Auth Check Error:", err.message);
      setAuth(false);
    }
  };

  useEffect(() => {
    isAuth();
  }, []);

  return (
    <Router>
      <Routes>
        <Route
          path="/register"
          element={
            !isAuthenticated ? (
              <Register setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        <Route
          path="/login"
          element={
            !isAuthenticated ? (
              <Login setAuth={setAuth} />
            ) : (
              <Navigate to="/dashboard" />
            )
          }
        />
        <Route
          path="/dashboard"
          element={
            isAuthenticated ? (
              <Dashboard setAuth={setAuth} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;

