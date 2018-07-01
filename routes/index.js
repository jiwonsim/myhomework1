var express = require('express');
var router = express.Router();

/* GET home page. */
router.use('/signin', require('./users/signin.js'));	// localhost:3000`/signin`
router.use('/signup', require('./users/signup.js'));	// localhost:3000`/signup`

// router.use('/call', require('./board/call.js'));	// localhost:3000`/signin
// router.use('/register', require('./board/register.js'))

router.use('/board', require('./board/index.js'));
router.use('/bookmark', require('./bookmark/index.js'));
router.use('/comment', require('./comment/index.js'))
module.exports = router;
