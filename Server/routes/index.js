const express = require('express');
const router = express.Router();
const multer = require('multer')
const storage = multer.memoryStorage();
const upload = multer({storage: storage});
const userController = require('../controllers/userController');
const levelController = require('../controllers/LevelController')
const constructorController = require('../controllers/constructorcontroller')

router.post('/users', userController.createUser);
router.get('/users', userController.getUsers);
router.put('/users',userController.updateUsers);
router.post('/level', levelController.setLevel);
router.get('/level', levelController.getLevel);
router.post('/constructor',upload.single("img"), constructorController.setConstructor);
module.exports = router;