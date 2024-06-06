const express = require('express')
const userController = require("../controllers/userController")

const router = express.Router();

// token auth middleware for routes below
router.use(userController.protect);

router.route('/').get(userController.getUsers)
router.route('/').post(userController.register);

router
    .route('/:id')
    .get(userController.getUserById)
    .put(userController.updateUser)
    .delete(userController.deleteUser);

module.exports = router;