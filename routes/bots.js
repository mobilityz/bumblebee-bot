var express = require('express');
var router = express.Router();

var Bot = require('../models/bot');

/* GET bots listing. */
router.get('/', function(req, res, next) {
  Bot.find({}, function(err, bots) {
    if (err) throw err;
    res.send(bots);
  });
});

router.post('/', function(req, res, next) {
  var newBot = Bot(req.body);

  newBot.save()
  .then(function(bots) {
    res.send(bots);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;
