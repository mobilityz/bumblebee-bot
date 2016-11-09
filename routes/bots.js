var express = require('express');
var router = express.Router();
var bot = require('../models/bot');
var trip = require('../lib/trip')

/* GET bots listing. */
router.get('/', function(req, res, next) {
  bot.find({})
  .then(function(bots) {
    res.send(bots);
  })
  .catch(function(err) {
    res.status(500).err(err);
  });
});

router.post('/', function(req, res, next) {
  var newBot = bot(req.body);

  newBot.save()
  .then(function(bot) {
    res.send(bot);
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.put('/:id', function(req, res, next) {
  bot.update({_id: req.params.id}, req.body)
  .then(function(result) {
    res.send();
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.delete('/:id', function(req, res, next) {
  bot.remove({ _id: req.params.id })
  .then(function(result) {
    res.send();
  })
  .catch(function(err) {
    res.status(500).send(err);
  });
});

router.post('/generate_trip', function(req, res, next) {
  trip.generate_trip(req.body.startPoint, req.body.endPoint);
  res.send();
});

module.exports = router;
