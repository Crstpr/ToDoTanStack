const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());


app.post("/todo", async (req, res)=>{
    try {
        const { description } = req.body;
        const newTodo = await pool.query("INSERT INTO todot(description) VALUES($1) RETURNING *", [description]);
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/todo", async(req, res)=>{
    try {
        const getAllTodo = await pool.query("SELECT * FROM todot");
        res.json(getAllTodo.rows)
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/todo/:id", async(req, res)=>{
    try {
        const { id } = req.params;
        const deleteTodo = await pool.query("DELETE FROM todot WHERE id=$1", [id]);
        res.json("Task has been deleted!");
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(5000, ()=>{
    console.log("server started on port 5000");
})