import "./App.css";
import React, { Fragment, useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

import Dashboard from "./components/Dashboard";
import Login from "./components/Login";
import Register from "./components/Register";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  };

  const isAuth = async () => {
    try {
      const token = localStorage.getItem("token"); // ✅ Get token safely
      if (!token) {
        setAuth(false);
        return;
      }

      const response = await fetch("http://localhost:5001/auth/is-verify", {
        method: "GET",
        headers: {token },
      });

      const parseRes = await response.json();
      parseRes === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
    } catch (err) {
      console.error("Auth Check Error:", err.message);
      setAuth(false);
    }
  };

  useEffect(() => {
    isAuth();
  }, []); // ✅ Runs only once on mount

  return (
    <Fragment>
      <Router>
        <Routes>
          <Route
            path="/register"
            element={!isAuthenticated ? <Register setAuth={setAuth} /> : <Navigate to="/login" />}
          />
          <Route
            path="/login"
            element={!isAuthenticated ? <Login setAuth={setAuth} /> : <Navigate to="/dashboard" />}
          />
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard setAuth={setAuth} /> : <Navigate to="/login" />}
          />

        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;

