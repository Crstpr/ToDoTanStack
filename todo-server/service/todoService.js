const todoRepository = require('../repository/todoRepository');

const createTodo = async(user_id, description, title, dueDate, isDone) => {
    try {
        return await todoRepository.createTodo(user_id, description, title, dueDate, isDone);
    } catch (err) {
        console.error(err.message);
    }
}

const getAllTodo = async (user_id, search) => {
    try {
        return await todoRepository.getAllTodo(user_id, search);
    } catch (err) {
        console.error(err.message);
    }
}

const updateTodo = async (id, isDone) => {
    try {
        return await todoRepository.updateTodo(id, isDone);
    } catch (err) {
        console.error(err.message);
    }
}

const deleteTodo = async (user_id, id) => {
    try {
        return await todoRepository.deleteTodo(user_id, id);
    } catch (err) {
        console.error(err.message);
    }
}

module.exports = {createTodo, getAllTodo, updateTodo, deleteTodo};