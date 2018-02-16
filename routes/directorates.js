var express = require('express');
var router = express.Router();

/* GET directorates listing. */
router.get('/', function(req, res, next) {
  res.render('directorate', { title: 'Igazgatóságok', data: [] });
});

module.exports = router;
