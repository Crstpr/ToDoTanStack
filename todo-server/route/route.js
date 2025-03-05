const express = require('express');
const router = express.Router();
const todoController = require('../controller/controller');
const authorization = require('/Users/user/Desktop/typescript-todo/login-server/middleware/authorization');

router.post('/', authorization, todoController.create);
router.get('/', authorization, todoController.getAll);
router.put('/:id', todoController.update);
router.delete('/:id', authorization, todoController.deletes);

module.exports = router;

