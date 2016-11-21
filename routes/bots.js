var express = require('express');
var router = express.Router();
var Bot = require('../models/bot');
var geometry = require('../lib/geometry');
var job = require('../lib/job');

/* GET bots listing. */
router.get('/', (req, res, next) => {
  Bot.find({})
  .then((bots) => {
    res.send(bots);
  })
  .catch((err) => {
    res.status(500).err(err);
  });
});

router.post('/', (req, res, next) => {
  var newBot = Bot(req.body);
  newBot.save()
  .then((bot) => {
    bot.drivers.forEach((id_driver) => {
      job.driver_new_trip(id_driver);
    });
    res.send(bot);
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.put('/:id', (req, res, next) => {
  Bot.update({_id: req.params.id}, req.body)
  .then((result) => {
    res.send();
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.delete('/:id', (req, res, next) => {
  Bot.remove({ _id: req.params.id })
  .then((result) => {
    res.send();
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/:id/deactivate', (req, res, next) => {
  Bot.update({_id: req.params.id}, {active: false})
  .then((result) => {
    res.send();
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

router.post('/:id/active', (req, res, next) => {
  Bot.findByIdAndUpdate({_id: req.params.id}, {active: true})
  .then((bot) => {
    bot.drivers.forEach((id_driver) => {
      job.driver_new_trip(id_driver);
    });
    res.send();
  })
  .catch((err) => {
    res.status(500).send(err);
  });
});

module.exports = router;
