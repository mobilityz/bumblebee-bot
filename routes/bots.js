var express = require('express');
var router = express.Router();
var Bot = require('../models/bot');
var geometry = require('../lib/geometry');
var job = require('../lib/job');

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
    bot.drivers.forEach(function(id_driver) {
      job.driver_new_trip(id_driver);
    });
    res.send(bot);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.put('/:id', function(req, res, next) {
  Bot.update({_id: req.params.id}, req.body)
  .then(function(result) {
    res.send();
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.delete('/:id', function(req, res, next) {
  Bot.remove({ _id: req.params.id })
  .then(function(result) {
    res.send();
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

module.exports = router;
