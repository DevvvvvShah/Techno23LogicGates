const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const levelController = require('../controllers/LevelController')

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.get('/users/:name',userController.getUserByName);
router.put('/users/:name',userController.updateUsers);


router.post('/login',userController.login);


router.post('/level', levelController.setLevel);
router.get('/level', levelController.getLevel);
router.get('/level/:number', levelController.getLevelByNumber);

module.exports = router;