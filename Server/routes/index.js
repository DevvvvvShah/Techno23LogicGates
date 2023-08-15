const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const levelController = require('../controllers/LevelController')
const constructorController = require('../controllers/constructorcontroller')

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.put('/users',userController.updateUsers);
router.post('/level', levelController.setLevel);
router.get('/level', levelController.getLevel);
router.post('/constructor', constructorController.setConstructor);
module.exports = router;