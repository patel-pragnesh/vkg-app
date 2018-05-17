var express = require('express');
var router = express.Router();
const common = require('../controllers/commonController');
const User = require('../models/user');

// var user_controller = require('../controllers/mongodb_userController');
var user_controller = require('../controllers/userController');

/* GET users listing. */
router.get('/profile/:id', function(req, res, next) {
  //res.send('respond with a resource');
  let user = User.getUser(req.params.id);
  console.log(user);
});

/* GET user login. */
router.get('/logout', user_controller.logout_get);
router.get('/login', user_controller.login_get);
router.post('/login', user_controller.login_post);
router.get('/register', user_controller.register_get);
router.post('/register', user_controller.register_post);

module.exports = router;
