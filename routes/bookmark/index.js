var express = require('express');
var router = express.Router();

// router.use('/call', require('./call.js'));
// router.use('/register', require('./register.js'));

router.use('/', require('./bookmark.js'));

module.exports = router; 