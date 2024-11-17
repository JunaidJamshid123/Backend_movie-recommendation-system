const express = require('express');
const router = express.Router();
const listController = require('../controllers/list_controller');
const authMiddleware = require('../middlewares/auth_middleware');

// List routes
router.get('/', authMiddleware, listController.getAllLists);
router.get('/:id', authMiddleware, listController.getListById);
router.post('/', authMiddleware, listController.createList);
router.put('/:id', authMiddleware, listController.updateList);
router.delete('/:id', authMiddleware, listController.deleteList);

module.exports = router;