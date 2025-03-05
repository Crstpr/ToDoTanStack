const pool = require("../db");
const nanoid = require("../utils/idGenerator");

const createTodo = async(user_id, description, title, dueDate, isDone) => {
    const id = nanoid();
    const formattedDueDate = dueDate ? new Date(dueDate).toISOString().split("T")[0] : null;
    const isDoneValue = isDone !== undefined ? isDone : false;
    const result = await pool.query(
        'INSERT INTO todo_lists(id, user_id, description, title, due_date, is_done) VALUES($1, $2, $3, $4, $5, $6) RETURNING *',
        [id, user_id, description, title, formattedDueDate, isDoneValue]
    );
    return result.rows[0];
};

const getAllTodo = async(user_id, search = '') => {
    let query = 'SELECT * FROM todo_lists WHERE user_id = $1';
    const queryParams = [user_id];

    if(search) {
        query += ' AND (title ILIKE $2)';
        queryParams.push(`%${search}%`);
    }

    query += " ORDER BY created_at DESC";
    const result = await pool.query(query, queryParams);
    return result.rows;
};

const updateTodo = async(id, isDone) => {
    const result = await pool.query("UPDATE todo_lists SET is_done = $1 WHERE id = $2 RETURNING *", [isDone, id]);
    return result.rows[0];
}

const deleteTodo = async(user_id, id) => {
    const result = await pool.query("DELETE FROM todo_lists WHERE user_id = $1 AND id = $2 RETURNING *", [user_id, id]);
    return result.rowCount > 0;
}

module.exports = {createTodo, getAllTodo, updateTodo, deleteTodo};