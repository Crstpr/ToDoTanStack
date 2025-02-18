import React, { Fragment, useState, useEffect } from "react";
import TaskForm from "./TaskForm";
import TodoList from "./TodoList";
const Dashboard = ({setAuth})=>{
    const [name, setName] = useState("");

    async function getName() {
        try {
            const response = await fetch("http://localhost:5001/dashboard/", {
                method: "GET",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();

            setName(parseRes.username);
        } catch (err) {
            console.error(err.message);
        }
    }

    const logout = (e) =>{
        e.preventDefault();
        localStorage.removeItem("token");
        setAuth(false);
    }

    useEffect(()=>{
        getName()  ;
    })
    return(
        <div>
            <h2>Welcome back, {name}</h2>
            
            <TaskForm></TaskForm>
            <TodoList></TodoList>
            <p></p>
            <p></p>
            <button onClick={e=>logout(e)} className="btn btn-danger">Logout</button>
        </div>
    );
};
export default Dashboard;