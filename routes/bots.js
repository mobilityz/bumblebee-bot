var express = require('express');
var router = express.Router();
var Bot = require('../models/bot');
var geometry = require('../lib/geometry');
var trip = require('../lib/trip');

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
    var start_points = geometry.randomPointsInPolygon(req.body.zone.properties.latLngs, req.body.zone.properties.bbox, req.body.nbDriver);
    var end_points = geometry.randomPointsInPolygon(req.body.zone.properties.latLngs, req.body.zone.properties.bbox, req.body.nbDriver);
    
    var i = 0;
    var drivers = [];
    while (i < req.body.nbDriver) {
      var driver = {
        startPoint: {lat: start_points[i].lat, lng: start_points[i].lng},
        endPoint: {lat: end_points[i].lat, lng: end_points[i].lng},
        tripSteps: [],
        currentStep: {index: 0, position: {lat: start_points[i].lat, lng: start_points[i].lng}}
      };
      drivers.push(driver);
      i++;
    }

    drivers.forEach(function(driver, index, array) {
      var coords = { origin: driver.startPoint, destination: driver.endPoint };
      trip.generate_trip(coords, function(tripPath){
        tripPath.forEach(function(step) {
          driver.tripSteps.push([step.lat, step.lng]);
        });
        if (index === array.length - 1){ 
          res.send({bot: bot, drivers: drivers});
        }
      });
    });
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
