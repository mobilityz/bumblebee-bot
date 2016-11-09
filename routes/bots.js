var express = require('express');
var router = express.Router();
var Bot = require('../models/Bot');

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

router.post('/generate_trip', function(req, res, next) {
  trip.generate_trip(req.body.startPoint, req.body.endPoint);
  res.send();
});

module.exports = router;
