const express = require('express')
const userController = require("../controllers/userController")

const router = express.Router();

router.route('/login').post(userController.login);

// token auth middleware for routes below
router.use(userController.protect);

router.route('/register').post(userController.register);

module.exports = router;