const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");

//middleware
app.use(cors());
app.use(express.json());


app.post("/todo", async (req, res) => {
    try {
        const { description, title, dueDate, isDone} = req.body;
        const formattedDueDate = dueDate ? new Date(dueDate).toISOString().split("T")[0] : null;
        const isDoneValue = isDone !== undefined ? isDone : false;
        const newTodo = await pool.query(
            'INSERT INTO todot(description, title, "dueDate", "isDone") VALUES($1, $2, $3, $4) RETURNING *',
            [description, title, formattedDueDate, isDoneValue]
        );
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

app.put("/todo/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const {isDone} = req.body;
        const updateTodo = await pool.query("UPDATE todot SET \"isDone\" = $1 WHERE id = $2 RETURNING *", [isDone, id] );
        res.json(updateTodo.rows[0]);
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