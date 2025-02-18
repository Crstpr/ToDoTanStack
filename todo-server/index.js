const express = require("express");
const app = express();
const cors = require("cors");
const pool = require("./db");
const { customAlphabet } = require('nanoid');
const authorization = require("../login-server/middleware/authorization");
//middleware
app.use(cors());
app.use(express.json());

const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ1234567890', 21);

app.post("/todo",authorization, async (req, res) => {
    try {
        const { description, title, dueDate, isDone} = req.body;
        const formattedDueDate = dueDate ? new Date(dueDate).toISOString().split("T")[0] : null;
        const isDoneValue = isDone !== undefined ? isDone : false;
        const id = nanoid();
        const user_id = req.user;
        const newTodo = await pool.query(
            'INSERT INTO todo_lists(id, user_id, description, title, due_date, is_done) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
            [id, user_id, description, title, formattedDueDate, isDoneValue]
        );
        res.json(newTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
});

app.get("/todo",authorization,async(req, res)=>{
    try {
        const user_id = req.user;
        const getAllTodo = await pool.query("SELECT * FROM todo_lists WHERE todo_lists.user_id = $1", [user_id]);
        res.json(getAllTodo.rows)
    } catch (err) {
        console.error(err.message);
    }
})

app.put("/todo/:id", async(req, res)=>{
    try {
        const {id} = req.params;
        const {isDone} = req.body;
        const updateTodo = await pool.query("UPDATE todo_lists SET is_done = $1 WHERE id = $2 RETURNING *", [isDone, id] );
        res.json(updateTodo.rows[0]);
    } catch (err) {
        console.error(err.message);
    }
})

app.delete("/todo/:id", authorization, async(req, res)=>{
    try {
        const { id } = req.params;
        const user_id = req.user;
        const deleteTodo = await pool.query("DELETE FROM todo_lists WHERE user_id = $1 AND id = $2 ", [user_id, id]);
        res.json("Task has been deleted!");
    } catch (err) {
        console.error(err.message);
    }
})

app.listen(5000, ()=> {
    console.log("server started on port 5000");
})