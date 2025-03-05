const todoService = require('../service/todoService');

const create = async(req , res) => {
    try {
        const {description, title, dueDate, isDone} = req.body;
        const user_id = req.user;   
        const newTodo = await todoService.createTodo(user_id, description, title, dueDate, isDone);    
        res.json(newTodo); 
    } catch (err) {
        console.error(err.message);
    }
};

const getAll = async(req, res) => {
    try {
        const user_id = req.user;
        const search = req.query.search;
        const getAllTodo = await todoService.getAllTodo(user_id, search);
        res.json(getAllTodo);
    } catch (err) {
        console.error(err.message);
    }
};

const update = async(req, res) => {
    try {
        const {id} = req.params;
        const {isDone} = req.body;
        const updateTodo = await todoService.updateTodo(id, isDone);
        res.json(updateTodo);
    } catch (err) {
        console.error(err.message);
    }
}

const deletes = async(req, res) => {
    try {
        const {id} = req.params;
        const user_id = req.user;
        const deleteTodo = await todoService.deleteTodo(user_id, id);
        res.json(deleteTodo);
        } catch (err) {
        console.error(err.message);
    }
}

module.exports = {create, getAll, update, deletes};