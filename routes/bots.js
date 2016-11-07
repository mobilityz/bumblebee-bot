var express = require('express');
var router = express.Router();

var Bot = require('../models/bot');

/* GET bots listing. */
router.get('/', function(req, res, next) {
  Bot.find({})
  .then(function(bots) {
    res.send(bots);
  })
  .catch(function(err) {
    res.status(500).err(err);
  });
});

router.post('/', function(req, res, next) {
  var newBot = Bot(req.body);

  newBot.save()
  .then(function(bot) {
    res.send(bot);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.put('/:id', function(req, res, next) {
  Bot.update(req.params.id, req.body)
  .then(function(res) {
    res.sendStatus(200);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;
